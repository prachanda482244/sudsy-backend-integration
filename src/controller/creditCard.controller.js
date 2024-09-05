import {
  getSessionId,
  updateCustomerPaymentMethod,
  getPaymentDetails,
  getCustomerIdByEmail,
} from "../helper/shopifyApi.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { shop, apiVersion, accessToken } from "../config/constants.js";
import { ApiError } from "../utils/ApiError.js";

// Express handler for changing credit card details
const changeCreditCardDetails = asyncHandler(async (req, res) => {
  try {
    const {
      email,
      card_number,
      ["expire-date"]: expiryDate,
      ["security-code"]: securityCode,
      ["name-card"]: nameCard,
      firstName,
      lastName,
      address1,
      address2,
      city,
      country,
      province,
      countryCode,
      company,
      phone,
      zip,
    } = req.body;

    const [month, year] = expiryDate.split("/");

    const fullYear = year.length === 2 ? `20${year}` : year;

    const creditCardDetails = {
      credit_card: {
        number: card_number,
        first_name: firstName,
        last_name: lastName,
        month: month,
        year: fullYear,
        verification_value: securityCode,
      },
    };
    const billingAddress = {
      address1: address1,
      address2: address2,
      city: city,
      province: province,
      country: country,
      zip: zip,
    };
    const sessionId = await getSessionId(creditCardDetails);

    const customerId = await getCustomerIdByEmail(
      email,
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
