import React, {useState, Fragment} from 'react';
import {NavLink, Link, useNavigate} from 'react-router-dom';
import SideBar from './sidebar(Teacher)'
import NavBar from './navBar'

import './golive.css';


function PreLive() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  return (
    <Fragment>
    <NavBar/>
    <SideBar/>

      <table>
        <tr>
          <td>
            <label>
              Title:
            </label>
          </td>
          <td>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </td>
        </tr>
        <tr>
          <td>
            <label>
              Description:
            </label>
          </td>
          <td>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          </td>
        </tr>
        <tr>
          <td>
            <label>
              Category:
            </label>
          </td>
          <td>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
          </td>
        </tr>
        <tr>
          <td>
            <label>
              Tags:
            </label>
          </td>
          <td>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <button onClick={() => parseIt(navigate, name, description, category, tags)}>Submit</button>
          </td>
        </tr>
      </table>
    <NavLink to="/GoLive">
      <a>GOLIVE</a>
    </NavLink>
    </Fragment>

  );
}

async function parseIt(navigate, name, description, category, tags){
  console.log(name);
  console.log(description);
  console.log(category);
  console.log(tags);

	let startDateTime = new Date();
  let user = "0001";


  await fetch("http://weteach.ddns.net:5000/api/v1/media", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDateTime : startDateTime,
      name : name,
      description : description,
      user : user
    }),
  })
  .catch(error => {
    window.alert(error);
    return;
  });

  navigate('/golive');
}

export default PreLive;
