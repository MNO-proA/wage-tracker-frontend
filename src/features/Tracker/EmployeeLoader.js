import { store } from "../../app/store";
import { employeeApiSlice } from "../Employees/employeeSlice";
import { TrackerApiSlice } from "./trackerSlice";
import { absenceApiSlice } from "../Absence/absenceSlice"

async function getEmployeesTracks() {
  const employeePromise = store.dispatch(employeeApiSlice.endpoints.getEmployees.initiate());
  const trackPromise = store.dispatch(TrackerApiSlice.endpoints.getTracks.initiate());
  const absencePromise = store.dispatch(absenceApiSlice.endpoints.getTracks.initiate());

  try {
    const [employees, tracks, absence] = await Promise.all([employeePromise.unwrap(), trackPromise.unwrap(), absencePromise.unwrap()]);
    return { employees, tracks, absence };
  } catch (e) {
    console.error("Error fetching employees and tracks:", e);
    return null;
  } finally {
    employeePromise.unsubscribe();
    trackPromise.unsubscribe();
    absencePromise.unsubscribe();
  }
}

export default async function loadEmployeesTracks() {
  return getEmployeesTracks();
}

