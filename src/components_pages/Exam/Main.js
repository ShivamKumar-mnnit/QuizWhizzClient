import React, { useRef } from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import './Home.css';
import useFetch from '../../hooks/fetch.hook';
import { useParams, useNavigate } from 'react-router-dom'


export default function Main ({CUId}) {
  const token = localStorage.getItem('token');
    const inputRef = useRef(null)
    const [{ apiData }] = useFetch();
    
    const params = useParams();
    const id = params;

    const [giverid,setGiverid]= useState([]);

    
  const navigate = useNavigate();

 

    useEffect(() => {
      getExams();
      // eslint-disable-next-line
  }, [])

    const getExams = async () => {
      console.log(id);
      const { data } = await axios.get(`https://quizwhizz.onrender.com/exam/exam/${id.id}`,{ headers: { Authorization: `Bearer ${token}` } });
      
      console.log(data);
      setGiverid(data.examGivers);
      
  }
  

  if(!CUId){
    return(
  <>loading...</>
    )
  }



  const startQuiz = async () => {

    const userId = CUId.toString(); // Convert userId to string
    const examId = id.id.toString(); // Convert examId to string
    const username = inputRef.current.value; // Assuming the username is obtained from the input field

    try {

      if (giverid.includes(CUId)) {
        alert('You have already completed this exam!');
        return; // Stop further execution if the user has already taken the exam
      }


      const response = await axios.post(
        'https://quizwhizz.onrender.com/userexams', // Replace with your API endpoint
        {
          userId,
          examId,
          userName: username,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const addGiverResponse = await axios.put(
        `https://quizwhizz.onrender.com/exam/addgivers/${examId}`, // Your endpoint to add examGivers
        { examGivers: [userId] }, // Assuming userId is the examGiver ID
        { headers: { Authorization: `Bearer ${token}` } }
      );
        console.log(addGiverResponse);
      // Handle success, e.g., redirect to the quiz page
      console.log('Quiz started:', response.data);
      // setuserexamid(response.data._id);
      navigate(`/examrunning/${id.id}`,{ state: { userexamid: response.data._id } }); // Redirect to the quiz page
    } catch (error) {
      // Handle error
      console.error('Error starting quiz:', error);
    }
  };


  return (
    <>
       <div className='container backgroundimagesetter fw-bold text-center'>
   
        <h1 className='title text-danger py-4'>Exam Application</h1>

        <ol>
            <li>You will be asked 10 questions one after another.</li>
            <li>10 points is awarded for the correct answer.</li>
            <li>Each question has three options. You can choose only one options.</li>
            <li>You can review and change answers before the quiz finish.</li>
            <li>The result will be declared at the end of the quiz.</li>
        </ol>
        
        <form id="form" className='my-4 text-center'>
            <input ref={inputRef} className="userid text-center" type="text" placeholder='Username*' defaultValue={apiData?.firstName || apiData?.username}
             readOnly/>
        </form>

        <div className='start my-4'>
        <button className='btn btn-success my-4' onClick={startQuiz} >
          Start Quiz
        </button>
        </div>
         
        <Link to="/"><button className='btn btn-info my-4'>Back to Home</button></Link>
    </div>
    </>
  )
}

  