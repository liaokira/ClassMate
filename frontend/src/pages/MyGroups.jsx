import { useState } from 'react'
import { Link } from "react-router-dom";
import logo from '../assets/react.svg';
import styled from "styled-components";

const Body = styled.div`
  background-color: var(--secondary);
  position: relative;
`;

const Banner = styled.div`
  height: relative;
  min-height: 50.9rem;
  width: relative;
  background-color: var(--secondary);
  margin-left: 14rem;
`;

const TabRow = styled.div`
  display: flex;
  padding-left: 6rem;
  padding-top: 6rem;
`;

const Tab = styled.div`
  height: 3rem;
  width: 10rem;
  background-color: var(--secondary);
  border: 3px solid var(--tertiary);
  border-top-left-radius: 10px;
  border-top-right-radius: 20px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const TabSelect = styled.div`
  height: 3rem;
  width: 10rem;
  background-color: var(--primary);
  border-top: 3px solid var(--tertiary);
  border-left: 3px solid var(--tertiary);
  border-right: 3px solid var(--tertiary);
  border-bottom: 3px solid var(--secondary);
  border-top-left-radius: 20px;
  border-top-right-radius: 10px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const GroupBlock = styled.div`
  background-color: var(--primary);
  height: 27rem;
  overflow-y: auto;
  scrollbar-width: none;
  width: relative;
  max-width: 80rem;
  margin-left: 6rem;
  padding-top: 3rem;
  padding-bottom: 6rem;
  border: 3px solid var(--tertiary);
  border-top-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  justify-content: space-between;
`;

const GroupRow = styled.div`
  display: flex;
  margin-top: 3rem;
  justify-content: space-evenly;
`;

const GroupsUnder = styled.div`
  height: relative;
  width: 10rem;
  border-bottom: 3px solid var(--tertiary);
`;

const Group = styled.div`
  height: 15rem;
  width: 15rem;
  border: 3px solid var(--tertiary);
  border-radius: 20px;
  background-color: var(--secondary);
`;

const ImageHolder = styled.div`
  height: 12rem;
  width: relative;
  background-color: black;
  border: 3px solid var(--tertiary);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GroupName = styled.div`
  height: relative;
  width: relative;
  background-color: var(--secondary);
`;

function PlaceHolder() {
  return (
    <Group>
        <ImageHolder><img src={logo} alt="Logo" /></ImageHolder>
        <GroupName></GroupName>
    </Group>
  );
}

function MyGroups() {
  return (
    <Body>
      <Banner>
        <TabRow>
            <TabSelect>
                <h2>Groups</h2>
            </TabSelect>
            <Tab>
                <h2>Discover</h2>
            </Tab>
        </TabRow>
        <GroupBlock>
            <GroupRow>
                <PlaceHolder/>
                <PlaceHolder/>
                <PlaceHolder/>
            </GroupRow>
            <GroupRow>
                <PlaceHolder/>
                <PlaceHolder/>
                <PlaceHolder/>
            </GroupRow>
        </GroupBlock>
      </Banner>
    </Body>
  );
}

export default MyGroups;
