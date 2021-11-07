import { useParams } from "react-router"
import { useState, useEffect } from "react"
import axios from "axios"
import { useCookies } from "react-cookie";
import "./Members.css"
import { Link } from "react-router-dom"
import uuid from 'react-uuid'

export default function MembersDetails() {
    const { name } = useParams()
    const [tickets, setTickets] = useState([])
    const [error, setError] = useState("")
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [welcome, setWelcome] = useState(cookies.user)

    function handleLogout() {
        removeCookie("user")
    }

    useEffect(() => {
        axios.get("http://localhost:4242/tickets")
            .then(res => setTickets(res.data))
            .catch(err => setError("Error when fetching tickets"))
    }, [])

    return (
        <div>
            <div className="homeContainer">
                <Link to="/login">
                    <button className="formButtonHome" onClick={handleLogout}>
                        Logout
                </button>
                </Link>
                <Link to={"/" + cookies.user}>
                    <button className="formButtonHome">
                        Profil
                </button>
                </Link>
                <div className="home">
                    <h2> Welcome to your blog {welcome} !</h2>
                    <p>{error}</p>
                </div>
                <div className="tickets">
                    {tickets.map((ticket) => {
                        if (ticket.id_user !== cookies.user && ticket.id_user === name) {
                            return (
                                <>
                                    <ul class="list-group list-group-flush">
                                        <li key={uuid()} class="list-group-item">
                                            {/* <a href="/shop/<%= product._id%>"> */}
                                            <u>{ticket.title}</u>
                                            {/* </a> */}
                                        </li>
                                        <li key={uuid()} class="list-group-item">
                                            {ticket.body}
                                        </li>
                                    </ul>
                                </>
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}
