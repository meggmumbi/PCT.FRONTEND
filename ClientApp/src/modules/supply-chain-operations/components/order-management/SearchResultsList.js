import { React, useState } from 'react'
import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {getFamilyProducts} from "../../apis/product-catalog";
import {NavLink} from "react-router-dom";


function SearchResultsList(props) {
   
    const {
        isLoading,
        isError,
        data
    } = useQuery(["getFamilyProducts", props.family], getFamilyProducts);

    if (isLoading) {
        return "...loading";
    }

    if (isError) {
        return "...error";
    }
    
    //create a new array by filtering the original array
    const filteredData = data.data._embedded.items.filter((el) => {
        //if no input the return the original
        if (props.input === '') {
            return "";
        }
        //return the item which contains the user input
        else {
            return el.identifier.toLowerCase().includes(props.input)
        }
    })
    return (
        <ul>
            {filteredData.map((item) => (
                <NavLink to={`/psa/product-details-page/${item.identifier}`}>
                    <li key={item.identifier}>{item.identifier}</li>
                </NavLink>
            ))}
        </ul>
    )
}

export default SearchResultsList