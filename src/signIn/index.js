// import React, { useEffect, useState } from 'react';
// import AutoForm from '../../../../../core/autoform/AutoForm';
// import { postData } from '../../../../../../backend/api';

// const SignIn = (props) => {

// const [formData, setFormData] = useState(null);
// const [TempFormData] = useState([
//     {
//         type: "number",
//         placeholder: "Enter your number",
//         name: "number",
//         validation: "",
//         default: "",
//         label: "",
//         required: false,
//         view: true,
//         add: true,
//         update: true,
//       },
//     {
//       type: "text",
//       placeholder: "Enter your name",
//       name: "name",
//       validation: "",
//       default: "",
//       label: "",
//       tag: false,
//       required: false,
//       view: true,
//       add: true,
//       update: true,
//     },
//     {
//       type: "text",
//       placeholder: "Designation",
//       name: "designation",
//       validation: "",
//       default: "",
//       label: "",
//       tag: false,
//        required: false,
//       view: true,
//       add: true,
//       update: true,
//     },
//     {
//       type: "text",
//       placeholder: "Company name",
//       name: "company",
//       validation: "",
//       default: "",
//       label: "",
//       tag: false,
//        required: false,
//       view: true,
//       add: true,
//       update: true,
//     },
//     {
//         type: "select",
//         placeholder: "Select your Gender",
//         name: "gender",
//         validation: "",
//         default: "",
//         tag: true,
//         label: "",
//         showItem: "Gender",
//         required: false,
//         view: true,
//         filter: false,
//         add: true,
//         update: true,
//         apiType: "CSV",
//         selectApi: "Male,Female",
//       },
//   ]);

//   useEffect(() => {
//     const temp = [...TempFormData];
//     setFormData(temp);
//   }, [TempFormData]);

//   const isCreatingHandler = (value, callback) => {};
//   const submitChange = async (post) => {
//     postData({ ...post }, "ticket-form-data").then((response) => {
//       console.log(response, "response");
//       if (response.data.success === true) {
//         props.setMessage({
//           type: 1,
//           content: `Form Data Created Successfully`,
//           okay: "Okay",
//         });
//       }
//     });
//     // write your code here
//   };
//   const closeModal = () => {
   
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '20px' }}>
//       <h2>Verify your mobile number</h2>
//       {formData && (
//         <AutoForm
//           useCaptcha={false}
//           key={"elements"}
//           formType={"post"}
//           header={""}
//           description={""}
//           formInput={formData}
//           submitHandler={submitChange}
//           button={"Save"}
//           isOpenHandler={closeModal}
//           isOpen={true}
//           plainForm={true}
//           formMode={"single"}
//           customClass={"embed"}
//               css="plain head-hide"
//             //   style={{width:'100%'}}
//         ></AutoForm>
//       )}
//     </div>
//   );
// };

// export default SignIn;
