import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./Table.module.css";
import { FaTrashAlt } from 'react-icons/fa';
import { selectAllTracks, useGetTracksQuery, useDeleteTrackMutation } from "../features/Tracker/trackerSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { selectAllEmployees, useGetEmployeesQuery } from "../features/Employees/employeeSlice";
import { useDateContext } from '../Context/DateContext';
import ClipLoader from "react-spinners/ClipLoader"; 
import { selectAllAbsences, useGetAbsencesQuery } from "../features/Absence/absenceSlice";
import { FaSpinner } from "react-icons/fa";


const Table = ({ className = "" }) => {
  const { isLoading: tracksLoading } = useGetTracksQuery;
  const { isLoading: employeeLoading  } = useGetEmployeesQuery();
  const { isLoading: absenceLoading  } = useGetAbsencesQuery();
  const { date } = useDateContext();
  const recorded_tracks = useSelector(selectAllTracks)
  let filteredTracks = date? recorded_tracks.filter(track => track.start_date === date ) : recorded_tracks ;
  filteredTracks.sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
  filteredTracks = filteredTracks.slice(0, 5)
  const employees = useSelector(selectAllEmployees);
  const absence = useSelector(selectAllAbsences)
  const [loading, setLoading] = useState(false);

  const employeeLookup = employees.reduce((acc, employee) => {
    acc[employee.id] = employee.staff_name;
    return acc;
  }, {});

  useEffect(()=>{
    console.log(recorded_tracks)
  },[recorded_tracks])
  

  const [deleteTrack, { isLoading: isDeleting }] = useDeleteTrackMutation();

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete track with id: ${id}?`)) {
      try {
        await deleteTrack({ id }).unwrap();
        console.log(`Track with id: ${id} deleted successfully.`);
      } catch (error) {
        console.error(`Failed to delete track with id: ${id}`, error);
      }
    }
  };
  // ===================================================================================

  const mergeEmployeeTrackAndAbsence = (employeeRecords, trackRecords, absenceRecords) => {
    const mergedData = {};
  
    // Process employee records
    employeeRecords.forEach((employee) => {
      const staffId = employee.id;
      mergedData[staffId] = {
        ...employee,
        tracks: [],
        absences: [],
      };
    });
  
    // Process track records
    trackRecords.forEach((track) => {
      const staffId = track.staff_name; // This should be the staff_id
      if (mergedData[staffId]) {
        mergedData[staffId].tracks.push(track);
      }
    });
  
    // Process absence records
    absenceRecords.forEach((absence) => {
      const staffId = absence.staff_name; // This should be the staff_id
      if (mergedData[staffId]) {
        mergedData[staffId].absences.push(absence);
      }
    });
  
    return mergedData;
  };
  
  const convertToCSV = (mergedData) => {
    const rows = [
      [
        "staff_id",
        "staff_name",
        "employment_type",
        "hourly_rate",
        "job_title",
        "track_id",
        "start_date",
        "end_date",
        "house",
        "shift",
        "shift_start",
        "shift_end",
        "overtime_hours",
        "total_hours",
        "total_wage",
        "why_absent"
      ],
    ];
  
    Object.entries(mergedData).forEach(([staffId, data]) => {
      const absence = data.absences.length > 0 ? data.absences[0].why_absent : ""; // Assume only one absence record per employee
  
      if (data.tracks.length > 0) {
        data.tracks.forEach((track) => {
          rows.push([
            staffId,
            data.staff_name,
            data.employment_type,
            data.hourly_rate,
            data.job_title,
            track.id,
            track.start_date,
            track.end_date,
            track.house,
            track.shift,
            track.shift_start,
            track.shift_end,
            track.overtime_hours,
            track.total_hours,
            track.total_wage,
            absence
          ]);
        });
      } else {
        rows.push([
          staffId,
          data.staff_name,
          data.employment_type,
          data.hourly_rate,
          data.job_title,
          "", // No track_id
          "", // No start_date
          "", // No end_date
          "", // No house
          "", // No shift
          "", // No shift_start
          "", // No shift_end
          "", // No overtime_hours
          "", // No total_hours
          "", // No total_wage
          absence
        ]);
      }
    });
  
    return rows.map((row) => row.join(",")).join("\n");
  };
  
 
  
  

  
  // const downloadCSV = (csvData, filename) => {
  //   const blob = new Blob([csvData], { type: "text/csv" });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = filename;
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);
  // };

const downloadCSV = () => {
  console.log(absence)
  setLoading(true);
  const mergedData = mergeEmployeeTrackAndAbsence(employees, recorded_tracks, absence);
  const csvData = convertToCSV(mergedData);
  const blob = new Blob([csvData], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "employee_track_data.csv";
  a.click();
  setLoading(false); 
  console.log(mergedData)
};




  // ==================================================================================

  return (
    <div className={[styles.table, className].join(" ")} style={{marginBottom:'10px'}}>
        <div className="col-4 d-flex justify-content-end align-items-center" style={{marginTop:'-65px'}} >
      {/* {logoutLoading ? ( 
        <FaSpinner className="spinner" />
      ) : ( */}
        <button className="btn btn-success" onClick={downloadCSV} >
        {/* {loading ? <FaSpinner className="spinner" /> : "Download CSV"} */}
        Download CSV
        </button>
      {/* )} */}
    </div>
      <div className="container mt-5" >
      <table className="table table-hover table-responsive">
        <thead className="thead-dark">
          <tr>
        
            <th>Date</th>
            <th>Staff Name</th>
            <th>Total Hours</th>
            <th>Total Wage</th>
            {/* <th>Acc Wage</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTracks.map((track) => (
            <tr key={track?.id}>
             
              <td>{track?.start_date}</td>
              <td>{employeeLookup[track.staff_name].split(' ').map(name =>
                      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
                    ).join(' ') || 'Unknown'}</td>
              <td>{track?.total_hours}</td>
              <td>€{track?.total_wage}</td>
              {/* <td>${track.accWage}</td> */}
              <td>
                <button className="btn btn-danger" onClick={() => handleDelete(track.id)}>
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

Table.propTypes = {
  className: PropTypes.string,
};

export default Table;
