import { ApiError } from "../utils/ApiError.js";
import axios from "axios";

const getSessionId = async (creditCardDetails) => {
  const { data } = await axios.post(
    "https://elb.deposit.shopifycs.com/sessions",
    creditCardDetails
  );
  if (!data) throw new ApiError(404, "session id not found");
  return data?.id;
};

const getCustomerIdByEmail = async (email, shop, accessToken, apiVersion) => {
  console.log(email);
  const query = `{
        customers(first: 1, query: "email:'${email}'") {
          edges {
            node {
              id
              firstName
              lastName
            }
          }
        }
      }`;

  try {
    const { data } = await axios.post(
      `https://${shop}/admin/api/${apiVersion}/graphql.json`,
      { query },
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );
    const customer = data.data.customers.edges[0]?.node;
    if (customer) {
      return customer.id;
    } else {
      console.log("Customer not found");
      return null;
    }
  } catch (error) {
    console.error(
      "Error fetching customer ID:",
      error.response?.data?.errors || error.message
    );
  }
};

const getPaymentDetails = async ({
  customerId,
  shop,
  accessToken,
  apiVersion,
}) => {
  const query = `
      {
        customer(id: "${customerId}") {
          firstName
          lastName
          email
          paymentMethods(first: 5) {
            edges {
              node {
                id
              }
            }
          }
        }
      }`;

  try {
    const { data } = await axios.post(
      `https://${shop}/admin/api/${apiVersion}/graphql.json`,
      { query },
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    const customer = data.data.customer;
    return customer.paymentMethods.edges[
      customer.paymentMethods.edges.length - 1
    ].node.id;
  } catch (error) {
    console.error(
      "Error fetching payment details:",
      error.response?.data?.errors || error.message
    );
  }
};
const updateCustomerPaymentMethod = async ({
  billingAddress,
  id,
  sessionId,
  shop,
  apiVersion,
  accessToken,
}) => {
  const query = `
          mutation customerPaymentMethodCreditCardUpdate($billingAddress: MailingAddressInput!, $id: ID!, $sessionId: String!) {
              customerPaymentMethodCreditCardUpdate(billingAddress: $billingAddress, id: $id, sessionId: $sessionId) {
                  customerPaymentMethod {
                     id
                  }
                  processing
                  userErrors {
                      field
                      message
                  }
              }
          }
      `;

  const variables = {
    billingAddress,
    id,
    sessionId,
  };
  try {
    const url = `https://${shop}/admin/api/${apiVersion}/graphql.json`;

    const { data } = await axios.post(
      url,
      {
        query,
        variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error(
      "Failed to update customer payment method: " + error.message
    );
  }
};

export {
  getSessionId,
  getCustomerIdByEmail,
  getPaymentDetails,
  updateCustomerPaymentMethod,
};
   