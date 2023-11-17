import React from 'react'
import styled from 'styled-components'
import { Link } from "react-router-dom";

import logo from '../assets/img/quizzwizz.png'

const Container = styled.div`
height:60px;
background-color:skyblue;
`

const Wrapper = styled.div`
padding:0px 20px;
display:flex;
align-items:center;
justify-content:space-between
`

const Left = styled.div`
flex: 1;
display: flex;
align-items: center;
`

const Logo = styled.div`
font-family: 'Square Peg', cursive;
font-size:32px;
font-weight:600;
cursor:pointer;
color:#00ADB5;
margin-left:10%;
padding:10px 12px;
`

const MenuItem = styled.button`
font-size: 20px;
cursor: pointer;
background-color: skyblue;
color:black;
fontWeight: bold;
padding:20px 12px;
border:none;
&:hover {
    background-color: gray;
  }
`

const Right = styled.div`
flex:1;
display:flex;
align-items: center;
justify-content:flex-end;
`

const MenuItemFirst = styled.div`
width:96px;
margin-right:10%;
margin-left:25px;
cursor: pointer;
border:none;
background-color:#5cb85c;
color:#EEEEEE;
padding:10px 20px;
border-radius:50px;
&:hover {
    background-color: #75DB75;
  }
`

const MenuItemSecond = styled.div`
margin-left:25px;
cursor: pointer;
border:none;
background-color:#0275d8;
color:#EEEEEE;
padding:10px 20px;
border-radius:5px;
&:hover {
    background-color: #228CE9;
  }
`


const Navbar = () => {
    return (
        <Container>
            <Wrapper>
                <Left>

                    <Link to="/"><Logo><img src={logo} alt="..." width="100" height="25" /></Logo></Link>
                    <Link to="/">
                        <MenuItem>Home</MenuItem>
                        </Link>
                    <MenuItem>Features</MenuItem>
                   
                </Left>
                <Right>
                    <Link to="/login" style={{ textDecoration: "none" }}>
                        <MenuItemSecond>Login</MenuItemSecond>
                    </Link>
                    <Link to="/register" style={{ textDecoration: "none", marginRight: "10%" }}>
                        <MenuItemFirst>Sign up</MenuItemFirst>
                    </Link>
                </Right>
            </Wrapper>
        </Container>
    )
}

export default Navbar