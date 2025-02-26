
import React from "react";
import styled from "styled-components";

const Card = styled.div`
  width: 20vw; /* Scales with viewport width */ /* Prevents it from being too large on big screens *//* Proportional height */
  display: flex;
  flex-direction: column;
`;

const TopHalf = styled.div`
  height: 15vh;
  background-color: ${(props) => props.inner};
  border: 3px solid ${(props) => props.outer}; /* Scales with screen */
  display: flex;
  border-radius: 1vw 1vw 0 0; /* Scales the border radius */
`;

const BottomHalf = styled.div`
  background-color: var(--primary);
  padding-left: 1vw;
  padding-right: 1vw;
  border: 3px solid var(--tertiary);
  border-top: none;
  border-radius: 0 0 1vw 1vw;
  text-wrap:wrap;
`;

const Header = styled.div`
  display: flex;
  align-items: center; /* Ensures vertical centering */
  justify-content: left;
padding: .5vw;
padding-top:1vw;
  
  h2 {
    margin: 0px;
    text-align:left;
    overflow-wrap: break-word; /* Ensures text breaks properly */
  }
`;


const ClassItem = styled.div`
font-family: Lato;
font-size: 2vh;;
  border-radius: 1rem;
    padding:10px;
    background-color: var(--secondary);
    display:flex;
    justify-content: space-between;
    align-items:center;
    flex-shrink: 0;
    width:fit-content;
    display: inline-block
`;

const Description = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  padding-bottom: 3vh;
  word-wrap: break-word; /* Allows text to wrap */
  overflow-wrap: break-word; /* Ensures long words break */
  padding:.5vw;
  padding-bottom:1vw;
  padding-top:0px;
`;

function GroupCard({ name, groupclass, description, link, color}) {

    const colors = {
        red: {
          normal: "#D27D7D",  // Desaturated red
          dark: "#A35F5F",    // Darker, more neutral red
        },
        yellow: {
          normal: "#D1B37C",  // Desaturated yellow
          dark: "#A78D62",    // Darker, more neutral yellow
        },
        green: {
          normal: "#7DAF89",  // Desaturated green
          dark: "#5E8A6A",    // Darker, more neutral green
        },
        blue: {
          normal: "#7D9ABD",  // Desaturated blue
          dark: "#5F7991",    // Darker, more neutral blue
        },
        purple: {
          normal: "#9F7DAF",  // Desaturated purple
          dark: "#7A5F86",    // Darker, more neutral purple
        }
    }
  
return (
    <Card>
        <TopHalf inner={colors[color]['normal']} outer={colors[color]['dark']}>
        </TopHalf>
        <BottomHalf>
            <Header>
            <h2>{name} <ClassItem>{groupclass}</ClassItem></h2>
            </Header>
            <Description>{description}</Description>
        </BottomHalf>
    </Card>
);
}

  export default GroupCard;