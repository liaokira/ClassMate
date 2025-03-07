
import { Link } from "react-router-dom";
import styled from "styled-components";

const Card = styled.div`
  width: 20vw; /* Scales with viewport width */ /* Prevents it from being too large on big screens *//* Proportional height */
  display: flex;
  flex-direction: column;
`;

const TopHalf = styled.div`
position:relative;
  height: 10vh;
  background-color: ${(props) => props.inner};
  border: 3px solid ${(props) => props.outer}; /* Scales with screen */
  display: flex;
  border-radius: 1vw 1vw 0 0; /* Scales the border radius */
`;

const BottomHalf = styled.div`
position:relative;
  background-color: var(--primary);
  padding-left: 1vw;
  padding-right: 1vw;
  border: 3px solid var(--tertiary);
  border-top: none;
  border-radius: 0 0 1vw 1vw;
  text-wrap:wrap;
  min-height:30vh;
`;

const ButtonHolder = styled.div`
    position:absolute;
    right:1vw;
    bottom:1vw;
`

const Header = styled.div`
  display: flex;
  position:relative;
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
position:absolute;
right:1vw;
top:1vw;
font-family: Lato;
font-size: 2vh;;
  border-radius: 1rem;
    padding:10px;
    background-color: var(--primary);
    display:flex;
    justify-content: space-between;
    align-items:center;
`;

const Description = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  text-align:left;
  padding-bottom: 3vh;
  word-wrap: break-word;
  word-break: break-all;
  padding:.5vw;
  margin-bottom:10vh;
  padding-top:0px;
`;

function GroupCard({ name, groupclass, description, link, color, joined}) {
    const slice = (description) => {
        return description.length > 75 ? description.slice(0, 75) + "..." : description;
    };

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
        <ClassItem>{groupclass}</ClassItem>
        </TopHalf>
        <BottomHalf>
            <Header>
            <h2>{name}</h2>
            </Header>
            {description!="Add a group description..." &&(
                <Description>{slice(description)}</Description>
            )
            }
            <ButtonHolder>
                <Link to={`/messaging/${link}`}>
                    <button>
                        View <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right-short" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
</svg>
                    </button>
                </Link>
            </ButtonHolder>
        </BottomHalf>
    </Card>
);
}

  export default GroupCard;