import Location from '../components/Location';
import Member from '../components/Member';

function Newrequest(){
    return(
        <>
            <div className="newrequest">
                <Location />
                <Member />
            </div>
        </>
    );
}

export default Newrequest;