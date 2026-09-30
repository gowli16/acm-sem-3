import Location from '../components/Location';
import Member from '../components/Member';
import Time from '../components/Time';
import Date from '../components/Date';
import Train from '../components/Train';
function Newrequest(){
    return(
        <>
            <div className="newrequest">
                <Location/>
                <Date/>
                <Member/>
                <Train/>
                <Time/>
            </div>
        </>
    );
}

export default Newrequest;