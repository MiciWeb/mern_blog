import React from 'react'
import { Link } from "react-router-dom"
import "./Home.css"
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react"
import axios from "axios";
import uuid from 'react-uuid'

export default function Home() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [welcome, setWelcome] = useState(cookies.user)
    const [tickets, setTickets] = useState([])
    const [error, setError] = useState("")
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [category, setCategory] = useState("")

    const onTitleChange = e => setTitle(e.target.value);
    const onBodyChange = e => setBody(e.target.value);
    const onCategoryChange = e => setCategory(e.target.value);


    function handleLogout() {
        removeCookie("user")
    }

    useEffect(() => {
        axios.get("http://localhost:4242/tickets")
            .then(res => setTickets(res.data))
            .catch(err => setError("Error when fetching tickets"))
    }, [])

    const handleSubmit = e => {
        e.preventDefault();

        if (body !== "" && title !== "") {
            const data = { welcome, title, body, category };

            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify(data)
            }
            fetch("http://localhost:4242/tickets", requestOptions)
            window.location.reload()
        }
    }


    function handleDelete(id) {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({id: id})
        }
        fetch("http://localhost:4242/delete/tickets", requestOptions)
        window.location.reload()
    }

    return (
        <div className="homeContainer">
            <Link to="/login">
                <button className="formButtonHome" onClick={handleLogout}>
                    Logout
                </button>
            </Link>
            <Link to="/">
                <button className="formButtonHome">
                    Home
                </button>
            </Link>
            <div className="home">
                <h2> Welcome to your blog {welcome} !</h2>
                <p>{error}</p>
            </div>
            <div className="tickets">
                <h3> Your last tickets: </h3>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <input className="input-add" onChange={onTitleChange} value={title} placeholder="title" />
                        <button className="btn btn-add btn-success" onClick={handleSubmit}>Add</button>
                    </li>
                    <li className="list-group-item">
                        <input className="input-add" onChange={onCategoryChange} value={category} placeholder="category" />
                    </li>
                    <li className="list-group-item body">
                        <input className="input-add" onChange={onBodyChange} value={body} placeholder="body" />
                    </li>
                    <br />
                    {tickets.map((ticket) => {
                        if (cookies.user == ticket.id_user) {
                            return (
                                <>
                                    <li key={uuid()} className="list-group-item">
                                        <u>{ticket.title}</u>
                                        <button className="del" onClick={() => handleDelete(ticket._id)}><i className="far fa-trash-alt"></i></button>
                                        <button className="edit"><i className="far fa-edit"></i></button>
                                    </li>
                                    <li key={uuid()} className="list-group-item body">
                                        {ticket.body}
                                    </li>
                                    <br />
                                </>
                            )
                        }
                    })}
                </ul>
            </div>
        </div>
    )
}
