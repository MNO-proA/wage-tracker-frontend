// In this code, the capitalizeFullName function takes firstName and lastName as parameters
// and returns the formatted full name.
// It follows the same logic as your original code,
// where it splits the full name into an array, capitalizes each name,
// and then joins them back into a full name.
export function capitalizeFullName(firstName, lastName) {
  const fullName = `${firstName} ${lastName}`;
  const names = fullName.split(" ");
  const capitalizedNames = names.map((name) => {
    const firstLetter = name.charAt(0).toUpperCase();
    const restOfName = name.slice(1).toLowerCase();
    return firstLetter + restOfName;
  });
  const capitalizedFullName = capitalizedNames.join(" ");
  return capitalizedFullName;
}

// This function takes a refreshToken as a parameter
// and sends a POST request to the /token/refresh/ endpoint.
// The refreshToken is included in the request body as a JSON payload.
// If the request is successful (response status code 200),
// the function parses the response JSON and extracts the new access token (data.access) and returns it.
// If the request fails or the response status code is not 200, an error is thrown with the appropriate error message.

import axios from "axios";
export async function refreshAccessToken(refreshToken) {
  const url = "http://127.0.0.1:8000/api/token/refresh/";

  try {
    const response = await axios.post(url, { refresh: refreshToken });

    if (response.status === 200) {
      const accessToken = response.data.access;
      return accessToken;
    } else if (response.status === 401) {
      throw new Error(`Status: Unauthorized, ${response.data.detail}`);
    } else {
      throw new Error(response.data.detail || "Failed to refresh access token");
    }
  } catch (error) {
    console.log(`${error.response.statusText} - ${error.response.data.detail}`);
  }
}

// We call the filterDepartments function and destructure the returned object to get the counts for each department.

export function filterDepartments(employees) {
  const hrEmployees = employees.filter(
    (employee) => employee.department === "HR"
  );
  const salesEmployees = employees.filter(
    (employee) => employee.department === "sales"
  );
  const inventoryEmployees = employees.filter(
    (employee) => employee.department === "inventory"
  );

  const counts = {
    hrCount: hrEmployees.length,
    salesCount: salesEmployees.length,
    inventoryCount: inventoryEmployees.length,
  };

  return counts;
}

// --------------------------------------------------------------|

export function calculatePercentage(value, total) {
  if (total === 0) {
    return 0; // To avoid division by zero error
  }

  const percentage = (value / total) * 100;
  return percentage.toFixed(2);
}
// --------------------------------------------------------------|

export function getRolesId(roles, employee) {
  return roles ? roles.find((rol) => rol?.name === employee?.role)?.id : "";
}
// --------------------------------------------------------------|
export function getDepsId(deps, employee) {
  return deps ? deps.find((dep) => dep?.name === employee?.department)?.id : "";
}
// --------------------------------------------------------------|
export function formatErrorMessage(data) {
  if (!data) {
    return "";
  }

  const errorMessages = Object.values(data).flat();
  const formattedErrorMessage = errorMessages.join(" ");

  return formattedErrorMessage;
}
// --------------------------------------------------------------|

// export function formatErrorMessage(data) {
//   if (!data) {
//     return "";
//   }

//   const errorMessages = [];

//   for (const field in data) {
//     const fieldErrors = data[field];
//     errorMessages.push(...fieldErrors);
//   }

//   const formattedErrorMessage = errorMessages.join("; ");

//   return formattedErrorMessage;
// }

// --------------------------------------------------------------|
export async function logoutEmployee(refreshToken) {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/employee/auth/logout/",
      {
        refresh_token: refreshToken,
      }
    );

    // Check the response status code
    if (response.status === 205) {
      // Logout successful
      return true;
    } else {
      // Logout failed
      return false;
    }
  } catch (error) {
    console.error("Error logging out:", error);
    return false;
  }
}
// --------------------------------------------------------------|
export function capitalizeFirstLetters(sentence) {
  let capitalizedSentence = sentence.toLowerCase();

  // Capitalize the first letter of the sentence
  capitalizedSentence = capitalizedSentence.replace(
    /^[a-z]|(?<=\. )[a-z]/g,
    (match) => match.toUpperCase()
  );

  return capitalizedSentence;
}
// --------------------------------------------------------------|
export function formatDate(dateString) {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.error(`Invalid date format: ${dateString}`);
    return null;
  }

  const formattedDate = date.toISOString().substring(0, 16);

  return formattedDate;
}
// --------------------------------------------------------------|

export function DisplayFormattedDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  // Extract date components
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();

  // Extract time components
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format the date and time
  const formattedDateTime = `${month} ${day}, ${year} at ${hours}:${minutes}`;

  return formattedDateTime;
}
// --------------------------------------------------------------|
