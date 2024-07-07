import { store } from "../../app/store";
import { employeeApiSlice } from "../Employees/employeeSlice";
import { TrackerApiSlice } from "./trackerSlice";

async function getEmployeesTracks() {
  const employeePromise = store.dispatch(employeeApiSlice.endpoints.getEmployees.initiate());
  const trackPromise = store.dispatch(TrackerApiSlice.endpoints.getTracks.initiate());

  try {
    const [employees, tracks] = await Promise.all([employeePromise.unwrap(), trackPromise.unwrap()]);
    return { employees, tracks };
  } catch (e) {
    console.error("Error fetching employees and tracks:", e);
    return null;
  } finally {
    employeePromise.unsubscribe();
    trackPromise.unsubscribe();
  }
}

export default async function loadEmployeesTracks() {
  return getEmployeesTracks();
}

