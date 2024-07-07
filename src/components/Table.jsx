import PropTypes from "prop-types";
import styles from "./Table.module.css";
import { FaTrashAlt } from 'react-icons/fa';
import { selectAllTracks, useGetTracksQuery, useDeleteTrackMutation } from "../features/Tracker/trackerSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { selectAllEmployees, useGetEmployeesQuery } from "../features/Employees/employeeSlice";
import { useDateContext } from '../Context/DateContext';



const Table = ({ className = "" }) => {
  const { isLoading: tracksLoading } = useGetTracksQuery;
  const { isLoading: employeeLoading  } = useGetEmployeesQuery();
  const { date } = useDateContext();
  const recorded_tracks = useSelector(selectAllTracks)
  const filteredTracks = date? recorded_tracks.filter(track => track.start_date === date ) : recorded_tracks ;
  const employees = useSelector(selectAllEmployees);

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

  return (
    <div className={[styles.table, className].join(" ")} style={{marginBottom:'10px'}}>
      <div className="container mt-5" >
      <table className="table table-hover table-responsive">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
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
              <td>{track?.id}</td>
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
