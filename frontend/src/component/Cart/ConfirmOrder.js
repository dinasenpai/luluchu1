import React, { Fragment } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import "./ConfirmOrder.css";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import axios from 'axios';

const ConfirmOrder = ({ history }) => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 200;

  const tax = subtotal * 0.18;

  const totalPrice = subtotal + tax + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const data = {
      user: user,
      cartItems: cartItems,
      shippingCharges : shippingCharges,
      totalPrice : totalPrice,
      shippingInfo : shippingInfo,
      tax : tax,
    };
  
    console.log(data);
    axios.post('http://localhost:4000/api/v1/create-checkout-session', {data})
      .then((res) => {
        console.log(res);
        if (res.data.url) {
          window.location.href = res.data.url;
        }
      })
      .catch((error) => console.log(error));

  
  };


  // const proceedToPayment = async (e) => {
  //   const amount = 5006769;
  //   const currency = "INR";
  //   const receiptId = "qwsaq1";
  //   const response = await fetch("http://localhost:4000/api/v1/payment/process", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       amount,
  //       currency,
  //       receipt: receiptId,
  //     }),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const order = await response.json();
  //   console.log(order);

  //   var options = {
  //     key: "rzp_test_9DvZVBgEEJiLUy", // Enter the Key ID generated from the Dashboard
  //     amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  //     currency,
  //     name: "Acme Corp", //your business name
  //     description: "Test Transaction",
  //     image: "https://example.com/your_logo",
  //     order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
  //     handler: async function (response) {
  //       const body = {
  //         ...response,
  //       };

  //       const validateRes = await fetch(
  //         "http://localhost:4000/api/v1/payment/process/validate",
  //         {
  //           method: "POST",
  //           body: JSON.stringify(body),
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       const jsonRes = await validateRes.json();
  //       console.log(jsonRes);
  //     },
  //     prefill: {
  //       //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
  //       name: "Web Dev Matrix", //your customer's name
  //       email: "webdevmatrix@example.com",
  //       contact: "9000000000", //Provide the customer's phone number for better conversion rates
  //     },
  //     notes: {
  //       address: "Razorpay Corporate Office",
  //     },
  //     theme: {
  //       color: "#3399cc",
  //     },
  //   };
  //   var rzp1 = new window.Razorpay(options);
  //   rzp1.on("payment.failed", function (response) {
  //     alert(response.error.code);
  //     alert(response.error.description);
  //     alert(response.error.source);
  //     alert(response.error.step);
  //     alert(response.error.reason);
  //     alert(response.error.metadata.order_id);
  //     alert(response.error.metadata.payment_id);
  //   });
  //   rzp1.open();
  //   e.preventDefault();
  // };



  return (
    <Fragment>
      <MetaData title="Confirm Order" />
      <CheckoutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          <div className="confirmshippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmshippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{user.name}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{shippingInfo.phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <Typography>Your Cart Items:</Typography>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item.product}>
                    <img src={item.image} alt="Product" />
                    <Link to={`/product/${item.product}`}>
                      {item.name}
                    </Link>{" "}
                    <span>
                      {item.quantity} X ₹{item.price} ={" "}
                      <b>₹{item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/*  */}
        <div>
          <div className="orderSummary">
            <Typography>Order Summery</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>₹{subtotal}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>₹{shippingCharges}</span>
              </div>
              <div>
                <p>GST:</p>
                <span>₹{tax}</span>
              </div>
            </div>

            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>₹{totalPrice}</span>
            </div>

            <button onClick={proceedToPayment}>Proceed To Payment</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
