import {useState} from "react";
function Member(){
    const [members, setMembers] = useState(1);
    function decrease(){
        if(members>1){
            setMembers(members-1);
        }
    }
    function increase(){
        if(members<3){
            setMembers(members+1);
        }
    }
    return(
        <>
            <div className="member">
                <h1>How many members do you want?</h1>
                <button onClick={decrease} disabled={members===1}>-</button>
                <span>{members}</span>
                <button onClick={increase} disabled={members===3}>+</button>
            </div>
        </>
    );
}

export default Member;