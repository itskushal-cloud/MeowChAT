// import Conversation from "../model/conersation.model.js";
// import Message from "../model/message.model.js";
// import User from "../model/user.model.js";


// steps 1 access the cookies and fetch the user id 
// step 2 find all the conversation ids that have my userid as a participant and mutual consent as true
// export const convo_list = async (req,res) => {
//     try {
        
//         const user_id=req.user.user_id;
//         const conversations= await Conversation.find({
//             participants:user_id,
//             Mutualconsent:true
//         })


//     }catch (error) {

//     }
// }

// export const search_friends = async (req,res) => {
//     // get list of all the user_ids in the data base who do not have me have an open conversation record with me and show all of their profiles to the user
//     try {

//     }catch (error) {

//     }
// }
// export const friend_req_incoming_list=async (req,res) => {
//     // get all the list of user id whose conversation table has me as a participant and mutual_connection as false and requested_by is not me
//     try {

//     } catch (error) {

//     }
// }

// export const send_friend_req = async (req,res) => {
//     // created a conversation id when someone requested fried req from search firends list 
//     // with mutualconsent as none and requested by the user id which is on cookies

//     const {user_id} = req.body;
//     try {

//     } catch (error) {

//     }
// }
// export const accept_friend_req = async (req,res) => {
//     // req.body has userid/username and req.cookie has my userid and set both of their consent in conversation table record as true
//     try {

//     } catch (error) {

//     }
// }

// export const convo = async (req,res) => {
//     // get conversation_id from req.body and then get all the messages from the messages table whose conversation id is this conversation id sort them by timme 
//     // show give response of whole list of all messages and keeps on updating it
//     try {

//     } catch (error) {

//     }
// }

// export const send_msg = async (req,res) => {
//     // get conversation id , text content from req.body and make a record in message table of these two conv id and text
    
//     try {

//     } catch (error) {

//     }
// }

