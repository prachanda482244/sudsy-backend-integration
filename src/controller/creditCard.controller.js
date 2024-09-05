import {
  getSessionId,
  updateCustomerPaymentMethod,
  getPaymentDetails,
  getCustomerIdByEmail,
} from "../helper/shopifyApi.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { shop, apiVersion, accessToken } from "../config/constants.js";

// Express handler for changing credit card details
const changeCreditCardDetails = asyncHandler(async (req, res) => {
  try {
    const data = req.body;

    // const {
    //   creditCardDetails,
    //   email,
    //   shop,
    //   accessToken,
    //   apiVersion,
    //   billingAddress,
    // } = data;

    const creditCardDetails = {
      credit_card: {
        number: "4242424242424242",
        first_name: "Bob",
        last_name: "Smith",
        month: "12",
        year: "2030",
        verification_value: "999",
      },
    };
    const billingAddress = {
      address1: "230 S. Main Street",
      address2: "",
      city: "Hecker",
      province: "Illinois",
      country: "United States",
      zip: "62248",
    };
    const sessionId = await getSessionId(creditCardDetails);

    const customerId = await getCustomerIdByEmail(
      "drewcam86@gmail.com",
      shop,
      accessToken,
      apiVersion
    );
    if (!customerId) {
      throw new Error("Customer not found");
    }

    const paymentMethodId = await getPaymentDetails({
      customerId,
      shop,
      accessToken,
      apiVersion,
    });

    const updatedPaymentMethod = await updateCustomerPaymentMethod({
      billingAddress,
      id: paymentMethodId,
      sessionId,
      shop,
      apiVersion,
      accessToken,
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedPaymentMethod,
          "Payment method updated successfully"
        )
      );
  } catch (error) {
    console.error("Error in changeCreditCardDetails:", error);
    res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          `Error updating payment method: ${error.message}`
        )
      );
  }
});

export { changeCreditCardDetails };
