import Message from "../components/Message";

const EmployeeScreen = ({match, history}) => {
    console.log(JSON.stringify(match), match.params.id);
    console.log(history);
    return (<div>
        <Message>Your Employee ID is {match.params.id}</Message>
    </div>);
}
 
export default EmployeeScreen;