import { FIREBASE_DOMAIN, FIREBASE_APIKEY } from "../../config";

export async function fetchUser(requestData) {
  let url;
  const { userData, action, login } = requestData;

  if (action === "createUser") {
    url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_APIKEY}`;
  } else {
    url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_APIKEY}`;
  }

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
      returnSecureToken: true,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    let errorMessage;

    if (data && data.error && data.error.message) {
      errorMessage = data.error.message;
    }
    throw new Error(errorMessage || "Something went wrong");
  }

  const tokenExpirationDate = new Date(
    new Date().getTime() + +data.expiresIn * 1000
  );

  login({
    token: data.idToken,
    userId: data.localId,
    tokenExpirationDate,
    displayName: data.displayName,
    email: data.email,
  });

  return data;
}

export async function updateProfile(requestData) {
  const { userData, token, action } = requestData;

  let bodyPayload = {
    displayName: userData.name,
    idToken: token,
    returnSecureToken: true,
  };

  if (action === "changePassword") {
    const res = await fetchUser({
      userData: { email: userData.email, password: userData.oldPassword },
      login: requestData.login,
    });

    bodyPayload = {
      password: userData.newPassword,
      idToken: res.idToken,
      returnSecureToken: true,
    };
  }

  let url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_APIKEY}`;

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(bodyPayload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    let errorMessage;

    if (data && data.error && data.error.message) {
      errorMessage = data.error.message;
    }
    throw new Error(errorMessage || "Something went wrong");
  }

  return data;
}

export async function updateAddress(requestData) {
  const response = await fetch(
    `${FIREBASE_DOMAIN}/user/"${requestData.userId}".json`,
    {
      method: "PUT",
      body: JSON.stringify({ address: requestData.address }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    let errorMessage;

    if (data && data.error && data.error.message) {
      errorMessage = data.error.message;
    }
    throw new Error(errorMessage || "Something went wrong");
  }

  return data;
}

export async function getAddress(requestData) {
  const response = await fetch(
    `${FIREBASE_DOMAIN}/user/"${requestData}"/address.json`
  );

  const data = await response.json();

  if (!response.ok) {
    let errorMessage;

    if (data && data.error && data.error.message) {
      errorMessage = data.error.message;
    }
    throw new Error(errorMessage || "Something went wrong");
  }

  return data;
}

export async function orderFood(requestData) {
  const response = await fetch(
    `${FIREBASE_DOMAIN}/user/"${requestData.userId}"/orders/.json`,
    {
      method: "POST",
      body: JSON.stringify({
        orderContent: requestData.orderContent,
        address: requestData.address,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    let errorMessage;

    if (data && data.error && data.error.message) {
      errorMessage = data.error.message;
    }
    throw new Error(errorMessage || "Something went wrong");
  }

  return data;
}

export async function getOrders(requestData) {
  const response = await fetch(
    `${FIREBASE_DOMAIN}/user/"${requestData}"/orders.json`
  );

  const data = await response.json();

  if (!response.ok) {
    let errorMessage;

    if (data && data.error && data.error.message) {
      errorMessage = data.error.message;
    }
    throw new Error(errorMessage || "Something went wrong");
  }

  return data;
}

export async function fetchMeals() {
  const response = await fetch(`${FIREBASE_DOMAIN}/meals.json`);

  const data = await response.json();

  if (!response.ok) {
    let errorMessage;

    if (data && data.error && data.error.message) {
      errorMessage = data.error.message;
    }
    throw new Error(errorMessage || "Something went wrong");
  }



  const loadedMeals = Object.values(data)[0].meals



  return loadedMeals;
}
