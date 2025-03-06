import styled from "styled-components";

const BodyStyle = styled.body`
  background-color: var(--secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  height:calc(100vh - 12vh);
`;

function Blank() {
  
  return (
    <BodyStyle>
    </BodyStyle>
  );
}

export default Blank;