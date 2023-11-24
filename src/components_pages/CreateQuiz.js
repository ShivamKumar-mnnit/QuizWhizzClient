import {  useEffect, useState } from 'react'
import styled from 'styled-components'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ArrowForward, AddCircle, RemoveCircleOutline } from '@mui/icons-material';
import Popup from 'reactjs-popup';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Link } from "react-router-dom";


const Container = styled.table`
      width: 100%;
      height:40vh;
      border-collapse: collapse;
      text-align: center;
      border-radius:8px;
      overflow: hidden;
      background-color:#EEEEEE;
  `;
const Wrapper = styled.div`
  width:86%;
  margin:7%;
  max-width:1300px;
  `
const Check = styled.input`
  transform : scale(1.5);
    margin:20px;
    color:;
  `
const Label = styled.label`
  color:;
  maxWidth:1400px;
  `
const Button = styled.button`
font-size:16px;
margin:10px;
padding:10px;
border:none;
border-radius:5px;
background-color:#0275d8;
color:#EEEEEE;
cursor: pointer;
&:hover {
    background-color: #228CE9;
  }
  `
const NextButton = styled.button`
font-size:16px;
margin:10px;
padding:10px;
border:none;
border-radius:5px;
background-color:#5cb85c;
color:#EEEEEE;
cursor: pointer;
&:hover {
    background-color: #75DB75;
  }
  `

const CreateQuiz = () => {
    const token = localStorage.getItem('token');

    const params = useParams();
    const id = params;

    const [options, setOptions] = useState([]);
    const [correctOption, setCorrectOption] = useState();
    const [inputFields, setInputFields] = useState([{ id: uuidv4(), option: '' }]);
    const [examDatas, setExamDatas] = useState([]);
    const [questionTitle, setQuestionTitle] = useState("");
    const [dummy, setDummy] = useState(0);
    const [dumy, setDumy] = useState(0);
    const [category,setCategory] = useState("");
    const [marks,setMarks] = useState(0);


    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
      };
    

    const addQuestion = async (e) => {
        e.preventDefault();
        if (correctOption === undefined) {
            alert("You have select an correct option")
        } else if (inputFields[0]?.option === "") {
            alert("You have to add a question to use Add Question feature")
        }
        else {

            const inputOption = await Promise.all(inputFields.map((inputF) => inputF.option))
            /* const index = inputOption.indexOf(correctOption)
            if (index > -1) {
                inputOption.splice(index, 1);
            } */
            console.log(inputOption);
            setOptions(inputOption);

            const newQuestion = {
                examId: id.id,
                questionTitle: questionTitle,
                questionCategory: category,
                questionMarks: marks
            };
            console.log(newQuestion)
            axios.post("https://quizwhizz.onrender.com/examquestions/", newQuestion,{ headers: { Authorization: `Bearer ${token}` } }).then((response) => {
                console.log(response.status);
                const data = response.data._id;
                handleOptions({ data, inputOption });
            });
             // After successful submission, reset form fields
        setInputFields([{ id: uuidv4(), option: '' }]);
        setQuestionTitle("");
        setCorrectOption(undefined);
        }
    }

    const handleOptions = ({ data, inputOption }) => {
        var questionOptions;
        var control;
        for (let i = 0; i < inputOption.length; i++) {
             questionOptions = inputOption[i];
            if (questionOptions === correctOption) {
                control = true
            } else {
                control = false
            }
            const option = {
                options: {
                    option: questionOptions,
                    isCorrect: control
                }
            }
            console.log(option);
            axios.put("https://quizwhizz.onrender.com/examquestions/" + data, option , { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
                console.log(response.status);
                console.log(response);
            });
        }
        setDumy(dumy + 1)
    }


    const handleChangeInput = async (id, event) => {
        const newInputFields = await Promise.all(inputFields.map(i => {
            if (id === i.id) {
                i[event.target.name] = event.target.value
            }
            return i;
        }))
        setInputFields(newInputFields);
    }

    const handleAddFields = () => {
        setInputFields([...inputFields, { id: uuidv4(), option: '' }])
    }

    const handleRemoveFields = id => {
        const values = [...inputFields];
        values.splice(values.findIndex(value => value.id === id), 1);
        setInputFields(values);
    }

    useEffect(() => {
        getExams();
        console.log("Check")
        // eslint-disable-next-line
    }, [options, dummy, dumy]);

    const getExams = async () => {
        console.log(id.id);
        const { data } = await axios.get('https://quizwhizz.onrender.com/examquestions/exam/' + id.id , { headers: { Authorization: `Bearer ${token}` } });
        setExamDatas(data);
        console.log(data)
    }

    const deleteQuestion = (propId) => {
        axios.delete('https://quizwhizz.onrender.com/examquestions/' + propId, { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
            console.log(response.status);
            console.log(response.data);
            setDummy(dummy + 1);
        });
    }

    return (
        <>
     
            <Container>
                <Wrapper>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow style={{ backgroundColor: "whitesmoke" }}>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {examDatas.map((exam, index) => (
                                    <TableRow key={exam._id || index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="exam" style={{ color: "#222831", fontSize: "16px", fontWeight: "600", padding: "25px" }}>
                                           
                                            <Label>{(index + 1) + " ) "}{exam.questionTitle}</Label>
                                            

                                            {exam.options.map((option) => (
                                                <>
                                                    <br /><Check type="radio" name={`${index + 1}`} />
                                                    <Label>{option.option}</Label>
                                                </>
                                            ))}
                                            <br />
                                            <Button style={{ backgroundColor: "red" }} onClick={() => deleteQuestion(exam._id)}>Delete</Button>
                                        </TableCell>
                                        <TableCell align="right"></TableCell>
                                        <TableCell align="right"></TableCell>
                                        <TableCell align="right"></TableCell>
                                        <TableCell align="right"><Label className='d-flex flex-row-reverse'>{exam.questionMarks}</Label></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>





                            <TableHead>
                                <TableRow>
                                    <Popup
                                        trigger={<Button style={{ marginLeft: "-65%" }}>Add Question</Button>}
                                        modal
                                        nested
                                    >
                                        {close => (
                                            <div style={{ fontSize: "12px", backgroundColor: "#393E46", width: "800px", height: "auto" }}>
                                                <button style={{ cursor: "pointer", position: "absolute", display: "block", padding: "2px 5px", lineHeight: "20px", right: "-10px", top: "-10px", fontSize: "24px", background: "#EEEEEE", borderRadius: "18px", border: "1px solid #cfcece" }} onClick={close}>
                                                    &times;
                                                </button>

                                                <div style={{ width: "100", borderBottom: "1px solid gray", fontSize: "18px", padding: "5px", color: "white" }}>New Question
                                                
                                                
                                                
                                                
                                                
        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
          <input
            type="radio"
            className="btn-check"
            name="category"
            id="radio1"
            value="MCQ"
            onChange={handleCategoryChange}
            autoComplete="off"
            checked={category === "MCQ"}
          />
          <label className="btn btn-outline-primary" htmlFor="radio1">
            MCQ
          </label>

          <input
            type="radio"
            className="btn-check"
            name="category"
            id="radio2"
            value="TF"
            onChange={handleCategoryChange}
            autoComplete="off"
            checked={category === "TF"}
          />
          <label className="btn btn-outline-primary" htmlFor="radio2">
           TF
          </label>

          <input
            type="radio"
            className="btn-check"
            name="category"
            id="radio3"
            value="SUB"
            onChange={handleCategoryChange}
            autoComplete="off"
            checked={category === "SUB"}
          />
          <label className="btn btn-outline-primary" htmlFor="radio3">
            Subjective
          </label>
        </div>

     
        <div className="container d-flex flex-row-reverse ">Marks:
        <input
        className='text-dark'
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            style={{ marginLeft: '10px', width: '50px'  }}
        />
    </div>

                                                </div>



                                                <div style={{ padding: "5px", fontSize: "16px", fontWeight: "500", color: "white" }}>Question: <textarea style={{ verticalAlign: "middle", maxWidth: "580px", maxHeight: "200px", width: "580px", color: 'black' }} type="text" onChange={e => setQuestionTitle(e.target.value)} /></div>
                                                <form onSubmit={addQuestion} style={{ width: "100%", padding: "10px 5px" }}>
                                                    {inputFields.map(inputField => (
                                                        <div key={inputField.id}>
                                                            <textarea
                                                                name="option"
                                                                label="First Name"
                                                                variant="filled"
                                                                value={inputField.option}
                                                                onChange={event => handleChangeInput(inputField.id, event)}
                                                                style={{ maxWidth: "650px", maxHeight: "200px", width: "650px" }}
                                                            />


                                                            <RemoveCircleOutline style={{ verticalAlign: "top", color: "#EEEEEE" }} disabled={inputFields.length === 1} onClick={() => handleRemoveFields(inputField.id)} />
                                                            <AddCircle style={{ verticalAlign: "top", color: "#EEEEEE" }} onClick={handleAddFields} />
                                                            <input style={{ verticalAlign: "top", color: "#EEEEEE" }} type="radio" name='correct' value={inputField.option} onClick={(e) => setCorrectOption(e.target.value)} />
                                                            <Label style={{ verticalAlign: "top", color: "#EEEEEE" }} htmlFor="correct">Correct</Label>


                                                        </div>
                                                    ))}
                                                    <div style={{ width: "100%", padding: "10px 5px", margin: "auto", textAlign: "center" }}>
                                                        <Popup
                                                            trigger={<Button className="formQButton" type='submit' style={{ width: "30%", marginRight: "10px" }}> Confirm </Button>}
                                                            position="top center"
                                                            nested
                                                        >
                                                        </Popup>
                                                        <Button
                                                            className="formQButton" onClick={() => { close(); }} style={{ width: "30%", backgroundColor: "#ECE2E1", color: "#100F0F" }}> Close
                                                        </Button>
                                                    </div>
                                                </form>



                                            </div>
                                        )}
                                    </Popup>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align='right'><Link to={`/configure/${id.id}`}><NextButton>Next<ArrowForward style={{ verticalAlign: "middle", transform: "scale(0.9)" }} /></NextButton></Link></TableCell>
                                </TableRow>
                            </TableHead>



                        </Table>
                    </TableContainer>
                </Wrapper>
            </Container>
         
        </>
    )
}

export default CreateQuiz