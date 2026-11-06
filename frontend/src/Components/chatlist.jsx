import { useState } from "react";
import "../App.css";


function Chatlist({friends=[]}) {
    const [cat_gender,setCat_gender] = useState("All");
    const f_list=cat_gender==="All" ? friends : friends.filter(friends => friends.gender===cat_gender);
    const listitems=f_list.map(frnd => <li key={frnd.username} className="conv_leaf m-5 ">
                                            <h3 className="conv_username">{frnd.username}</h3>
                                            <p className="conv_bio">{frnd.bio}</p>
                                        </li>);
    const filter_gen= (gen) => {
        setCat_gender(gen);
    }


    return <div className=" chatlist">
        <div className="filterlist">
            <button className= "  filter-button " onClick={() => filter_gen("All")} >All</button>
            <button className="   filter-button " onClick={() => filter_gen("female")} >Female</button>
            <button className="   filter-button "onClick={() => filter_gen("male")} >Male</button>
            <button className="   filter-button " onClick={() => filter_gen("non binary")}>Non binary</button>
            <button className=" filter-button " onClick={() => filter_gen("others")}>Others</button>
        </div>
        <ul className="list-decimal flex flex-col items-center  " > {listitems} </ul>
    </div>;


}



export default Chatlist;