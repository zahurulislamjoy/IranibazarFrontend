import React, { useState,useEffect} from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";

import { useLocation } from "react-router-dom";

import './sidebar.css'
 
const Nav = styled.div`
  background: #15171c;
  height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
 
const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
 
const SidebarNav = styled.nav`
  background: #15171c;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};
  transition: 350ms;
  z-index: 10;
`;
 
const SidebarWrap = styled.div`
  width: 100%;
`;

 
const Sidebar = (props) => {
  const [sidebar, setSidebar] = useState(false);
  const location = useLocation();

  //const [pageName, setpageName] = useState(JSON.stringify(localStorage.getItem('current_page_name')));
  useEffect(() => {
    setSidebar(false);
  }, [location.pathname]);


  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <Nav className="nav">
          <NavIcon to="#">
            <FaIcons.FaBars onClick={showSidebar} />
          </NavIcon>
          <h1 className="header"
            style={{ textAlign: "center",
                     
                     color: "green" }}
          >
            {/* MerinaSoft Computer Software */}
            {props.pageName}
          </h1>
          <div style={{color:"white", marginRight:"1vw"}} >Logout</div>
        </Nav>
        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
            <NavIcon to="#">
              <AiIcons.AiOutlineClose onClick={showSidebar} />
            </NavIcon>
            {SidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            })}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};
 
export default Sidebar;