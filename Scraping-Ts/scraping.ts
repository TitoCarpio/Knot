import axios from "axios";
import fs from "fs";

interface Cookie {
  name: string;
  value: string;
}

interface UserData {
  data: {
    profile: {
      firstName: string;
      lastName: string;
      birthDate: string;
      email: string;
      gender: string;
      homePhone: string;
      businessPhone: string;
      document: string;
      addresses: Address[];
    };
  };
}

interface Address {
  country: string;
  postalCode: string;
  state: string;
  city: string;
  street: string;
}

function getCookies(): string | null {
  const cookiesFilePath = "cookies.txt";

  // Check if the cookie file exists
  if (!fs.existsSync(cookiesFilePath)) {
    console.error(`The file '${cookiesFilePath}' does not exist.`);
    return null;
  }

  // Load and parse the cookie JSON file
  const cookiesJSON = fs.readFileSync(cookiesFilePath, "utf8");
  const cookies: Cookie[] = JSON.parse(cookiesJSON);

  // Converts JSON cookies to a valid cookie string for the request
  const cookiesString = cookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return cookiesString;
}

//function to print user data on console
function printUserData(userData: UserData): void {
  console.log(
    "----------------------------------------------------------------"
  );
  console.log("                           USER DATA:                           ");
  if (userData.data.profile == null) {
    console.error("Cookies expired");
    return;
  }

  // Extract user data
  const {
    firstName,
    lastName,
    birthDate,
    email,
    gender,
    homePhone,
    businessPhone,
    document,
  } = userData.data.profile;

  console.log("User Data:", {
    Name: firstName,
    Lastname: lastName,
    Birthdate: birthDate,
    Email: email,
    Gener: gender,
    HomePhone: homePhone,
    BusinessPhone: businessPhone,
    Document: document,
  });
}

//function that prints the user's addresses
function printUserAddress(userAddress: UserData): void {
  console.log(
    "----------------------------------------------------------------"
  );
  console.log("                           USER ADDRESS:                        ");
  // validation of the response of the request comes empty due to expired cookies
  if (userAddress.data.profile == null) {
    console.error("Cookies expired");
    return;
  }

  // the validation of the request response is empty because the user has no greyed out addresses
  if (userAddress.data.profile.addresses.length == 0) {
    console.error("User has no address record");
    return;
  }

  // Extract address data
  userAddress.data.profile.addresses.forEach((address, index) => {
    index++;
    console.log("Address: " + index, {
      Country: address.country,
      Postal_Code: address.postalCode,
      State: address.state,
      City: address.city,
      Street: address.street,
    });
  });
}

// Obtains user data
async function fetchUserDataWithCookies(): Promise<void> {
  try {
    // Getting cookies in a string
    const cookiesString = getCookies();

    if (cookiesString == null) {
      console.log("The request for user data could not be performed.");
      console.log(
        "----------------------------------------------------------------"
      );
      return;
    }

    // Making the POST request with axios that will allow me to get the user's data
    const response = await axios.post<UserData>(
      "https://www.prismamoda.com/_v/private/graphql/v1?workspace=master&maxAge=long&appsEtag=remove&domain=store&locale=es-SV",
      {
        // fields in the body of the request
        operationName: "Profile",
        variables: {},
        extensions: {
          persistedQuery: {
            version: 1,
            sha256Hash:
              "c85be2148d672083db2e34fef20a4b38887fc827cf0546741d0926cef8c2ef58",
            sender: "vtex.my-account^@1.x",
            provider: "vtex.store-graphql^@2.x",
          },
        },
      },
      {
        headers: {
          Cookie: cookiesString, // Set cookies in the header
        },
      }
    );

    // Handles the request response
    printUserData(response.data);
  } catch (error) {
    console.error("Error obtaining user data:", error);
    return ;
  }
}

// Obtains the user's address
async function fetchUserAddressWithCookies(): Promise<void> {
  try {
    // Getting cookies in a string
    const cookiesString = getCookies();
    if (cookiesString == null) {
      console.log("The request for user address could not be performed.");
      console.log(
        "----------------------------------------------------------------"
      );
      return;
    }

    // Making the POST request with axios that will allow me to obtain the user's addresses
    const response = await axios.post<UserData>(
      "https://www.prismamoda.com/_v/private/graphql/v1?workspace=master&maxAge=long&appsEtag=remove&domain=store&locale=es-SV",
      {
        // fields in the body of the request
        operationName: "Addresses",
        variables: {},
        extensions: {
          persistedQuery: {
            version: 1,
            sha256Hash:
              "0aa6dc896b55a617e32a6c42a58dccd2e016c6278243b236d595991732f85b40",
            sender: "vtex.my-account^@1.x",
            provider: "vtex.store-graphql^@2.x",
          },
        },
      },
      {
        headers: {
          Cookie: cookiesString, // Set cookies in the header
        },
      }
    );
    // Handles the request response
    printUserAddress(response.data);
  } catch (error) {
    console.error("Error obtaining user data:", error);
    return;
  }
}

// call of the functions
fetchUserDataWithCookies();
fetchUserAddressWithCookies();
