import React from "react";
import Layout from "../../components/shared/Layout/Layout";
import { useSelector } from "react-redux";

const AdminHome = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Layout>
      <div className="container">
        <div className="d-felx flex-column mt-4">
          <h1>
            Welcome Admin <i className="text-success">{user?.name}</i>
          </h1>
          <h3>Manage Blood Bank App </h3>
          <hr />
       
            <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <p>
        Welcome to our platform! We are dedicated to providing the best
        service to our users and ensuring a smooth and reliable experience.
        Our team works tirelessly to maintain high standards and deliver
        quality results. We believe in transparency, trust, and
        collaboration to achieve our goals.
      </p>
      <p>
        Our platform offers a wide range of features designed to meet the
        needs of our community. Whether you are here to contribute, learn, or
        connect, we strive to make your experience as seamless as possible.
        We are constantly improving and updating our services based on user
        feedback and industry best practices.
      </p>
      <p>
        Thank you for visiting! We hope you enjoy your time on our platform
        and find value in everything we have to offer. Your satisfaction and
        success are our top priorities.
      </p>
      </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminHome;
