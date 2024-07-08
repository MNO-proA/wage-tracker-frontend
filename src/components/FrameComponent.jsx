import { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from "prop-types";
import { FaUser, FaCalendarAlt, FaClock, FaChevronDown, FaHome } from "react-icons/fa"; // Importing icons from react-icons
import styles from "./FrameComponent.module.css";
import { selectAllEmployees, useGetEmployeesQuery } from "../features/Employees/employeeSlice"; // Adjust the path as per your project structure
import {useAddTrackMutation, TrackerApiSlice} from "../features/Tracker/trackerSlice"
import { store } from "../app/store";
import { useDateContext } from '../Context/DateContext';

import { useDispatch, useSelector } from "react-redux";
import { logOut, selectRefreshToken } from "../features/auth/authSlice"; // Update path as per your project structure
import { useLogoutMutation } from "../features/auth/authApiSlice"; // Update path as per your project 

import {useCreateAbsenceMutation, absenceApiSlice} from "../features/Absence/absenceSlice"
import { FaSpinner } from "react-icons/fa";


const HOUSE_CHOICES = [
  { value: 'jericho', label: 'Jericho House' },
  { value: 'howards', label: "Howard's House" }
];

const FrameComponent = ({ className = "" }) => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [staffName, setStaffName] = useState("");
  const [shift, setShift] = useState("");
  const [shiftStart, setShiftStart] = useState("");
  const [shiftEnd, setShiftEnd] = useState("");
  const [isAbsent, setIsAbsent] = useState(false);
  const [absenceReason, setAbsenceReason] = useState('');
  const [overtime, setOvertime] = useState("");
  const [house, setHouse] = useState("");
  const { isLoading } = useGetEmployeesQuery();
  const [addTrack, { isLoading: isAddLoading, isError, isSuccess }] =
  useAddTrackMutation();
  const [createAbsence, { isLoading: isAbsenceLoading }] =
  useCreateAbsenceMutation();
  
  const employees = useSelector(selectAllEmployees);
  // ----------------------------------------------------------
  const refreshToken = useSelector(selectRefreshToken);
  const [logout, { isLoading: logoutLoading }] =
  useLogoutMutation();
  // ----------------------------------------------------------

  const { date, setDate } = useDateContext();

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  useEffect(() => {
    console.log(employees)
  
  }, [employees]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let requestData = {}

    if (isAbsent){
      requestData = {
      date: startDate,
      staff_name: staffName,
      why_absent: isAbsent ? absenceReason?.toLocaleLowerCase() : null,
      
    }
    }else{
      requestData = {
        start_date: startDate,
        end_date: endDate,
        staff_name: staffName,
        shift:shift?.toLocaleLowerCase(),
        shift_start: shiftStart,
        shift_end: shiftEnd,
        overtime_hours: parseFloat(overtime) || 0,
        house:house?.toLocaleLowerCase(),
      };
    }

    try {
     if(!isAbsent){
      await addTrack(requestData).unwrap()
     }else{
      await createAbsence(requestData).unwrap()
     }
      
    
      toast.success("Track added successfully!");
      setStartDate("");
      setEndDate("");
      setStaffName("");
      setShift("");
      setShiftStart("");
      setShiftEnd("");
      setAbsenceReason("");
      setOvertime("");
      setHouse("");
    } catch (err) {
      console.log(err)
      toast.error("Failed to add track!");
    } finally{
      store.dispatch(TrackerApiSlice.endpoints.getTracks.initiate())
      store.dispatch(absenceApiSlice.endpoints.getTracks.initiate())
    }
  };
// =============================================================================



// Function to handle logout
const handleLogout = async () => {
  


  try {
    // Call the logout mutation API
   
    await logout(refreshToken);

    // If successful, dispatch the logout action to clear user state
    dispatch(logOut());
  } catch (error) {
    console.error("Error logging out:", error);
    // Handle error as needed
  }
};


  // Call handleLogout when clicking the logout button
  const handleLogoutClick = () => {
    handleLogout();

 
};




// ============================================================================

  return (
    <div className={`container ${className.frameWrapper}`} style={{marginBottom: "-10px"}}>
  <div className="row mb-4">
  <div className="col-12 d-flex justify-content-between align-items-center">
    <label htmlFor="startDate" className="form-label">Search by Date</label>
    <div className="input-group w-50">
      <span className="input-group-text"><FaCalendarAlt /></span>
      <input
        id="startDate"
        className="form-control"
        placeholder="Date"
        type="date"
        value={date}
        onChange={handleDateChange}
      />
    </div>
    <div className="col-4 d-flex justify-content-end align-items-center">
      {logoutLoading ? ( // Conditionally render spinner if logout is loading
        <FaSpinner className="spinner" />
      ) : (
        <button className="btn btn-success" onClick={handleLogoutClick}>
          Log out
        </button>
      )}
    </div>
  </div>
</div>


      <div className="row mb-4">
        <div className="col-12">
          <h3>JTA Employee Tracker</h3>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <label htmlFor="startDate" className="form-label">Start Date</label>
            <div className="input-group">
              <span className="input-group-text"><FaCalendarAlt /></span>
              <input
                id="startDate"
                className="form-control"
                placeholder="Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="endDate" className="form-label">End Date</label>
            <div className="input-group">
              <span className="input-group-text"><FaCalendarAlt /></span>
              <input
                id="endDate"
                className="form-control"
                placeholder="Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12 col-md-12">
            <label htmlFor="staffName" className="form-label">Staff Name</label>
            <div className="input-group">
              <span className="input-group-text"><FaUser /></span>
              <select
                id="staffName"
                className="form-control"
                value={staffName}
                
                onChange={(e) => setStaffName(e.target.value)}
              >
                <option value="" disabled>Select Staff Name</option>
                {employees?.map(employee => (
                  <option key={employee?.id} value={employee?.id}>
                    {employee?.staff_name.split(' ').map(name =>
                      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
                    ).join(' ')}
                  </option>
                ))}
              </select>
              <span className="input-group-text"><FaChevronDown /></span>
            </div>
          </div>
        </div>

        {isAbsent ? (
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="absenceReason" className="form-label">Absence Reason</label>
              <div className="input-group">
                <span className="input-group-text"><FaChevronDown /></span>
                <select
                  id="absenceReason"
                  className="form-control"
                  value={absenceReason}
                  onChange={(e) => setAbsenceReason(e.target.value)}
                >
                  <option value="" disabled>Select Absence Reason</option>
                  <option value="sick">Sick</option>
                  <option value="holiday">Holiday</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <>
        <div className="row mb-3">
          <div className="col-12 col-md-12">
            <label htmlFor="house" className="form-label">House</label>
            <div className="input-group">
              <span className="input-group-text"><FaHome /></span>
              <select
                id="house"
                className="form-control"
                value={house}
                onChange={(e) => setHouse(e.target.value)}
              >
                <option value="" disabled>Select House</option>
                {HOUSE_CHOICES.map(choice => (
                  <option key={choice.value} value={choice.value}>{choice.label}</option>
                ))}
              </select>
              <span className="input-group-text"><FaChevronDown /></span>
            </div>
          </div>
        </div>
            <div className="row mb-3">
              <div className="col-12 col-md-6">
                <label htmlFor="shift" className="form-label">Shift</label>
                <div className="input-group">
                  <span className="input-group-text"><FaChevronDown /></span>
                  <select
                    id="shift"
                    className="form-control"
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                  >
                    <option value="">Select Shift</option>
                    <option value="Day">Day</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12 col-md-6">
                <label htmlFor="shiftStart" className="form-label">Shift Start</label>
                <div className="input-group">
                  <span className="input-group-text"><FaClock /></span>
                  <input
                    id="shiftStart"
                    className="form-control"
                    placeholder="Shift Start"
                    type="time"
                    value={shiftStart}
                    onChange={(e) => setShiftStart(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <label htmlFor="shiftEnd" className="form-label">Shift End</label>
                <div className="input-group">
                  <span className="input-group-text"><FaClock /></span>
                  <input
                    id="shiftEnd"
                    className="form-control"
                    placeholder="Shift End"
                    type="time"
                    value={shiftEnd}
                    onChange={(e) => setShiftEnd(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12 col-md-6">
                <label htmlFor="overtime" className="form-label">Overtime (hours)</label>
                <div className="input-group">
                  <span className="input-group-text"><FaClock /></span>
                  <input
                    id="overtime"
                    className="form-control"
                    placeholder="Overtime"
                    type="number"
                    value={overtime}
                    onChange={(e) => setOvertime(e.target.value)}
                    min={0}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="row mb-3">
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={isAbsent}
                onChange={() => setIsAbsent(!isAbsent)}
              />
              <label className="form-check-label">
                Absence
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
           
            {isAddLoading || isAbsenceLoading ? ( // Conditionally render spinner if logout is loading
        <FaSpinner className="spinner" />
      ) : (
        <button
              className="btn btn-success"
              type="submit"
            >
              Add Track
            </button>
       
       
      )}
          </div>
        </div>
      </form>
      <ToastContainer position="top-right" />
    </div>
  );
};

FrameComponent.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent;

