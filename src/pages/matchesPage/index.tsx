import Header from '../../components/Header';
import { useMatches } from '../../hooks/useMatches';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolleyball } from '@fortawesome/free-solid-svg-icons'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import './matchesPage.css';

export default function MatchesPage() {
    const { queue, loading } = useMatches();

    const date = new Date();
  
  return (
    <div className="contentContainer">
      <Header />
    {loading ? ((<img src="src\assets\images\loading.gif" className="loadingFull"></img>)) : 
      <div className="teamsList">
        <h2 className='teamsListTitle'>Fila de times a jogar</h2>
          <p className='gameDay'>{date.getDate()}/{date.getMonth()+1}/{date.getFullYear()}</p>
        {queue.length === 0 ? (
          <div className="noTeamsRegistered">
          <FontAwesomeIcon icon={faVolleyball} className='faVolleyball' />
          <p className='noTeamsRegisteredText'>Nenhum time registrado</p>
          </div>
        ) : (
          <ul className="queueList">
            {queue.map((team, index) => (
              <li key={team.id} className='queueItem' style={{ animationDelay: `${index * 0.1}s` }}>
                <span className="queuePosition"><b>{index + 1}º</b><FontAwesomeIcon icon={faCaretRight} /></span>
                {team.team_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    }
    </div>
  );
}


// CÓDIGO PARA QUANDO HOUVER O ADMIN

// import Header from '../../components/Header';
// import { useMatches } from '../../hooks/useMatches';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faA } from '@fortawesome/free-solid-svg-icons'
// import { faB } from '@fortawesome/free-solid-svg-icons'
// import { faVolleyball } from '@fortawesome/free-solid-svg-icons'
// import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
// import './matchesPage.css';

// export default function MatchesPage() {
//   const { teamA, teamB, queue, loading } = useMatches();
  
//   return (
//     <div className="contentContainer">
//       <Header />
//       {loading ? (<img src="src\assets\images\loading.gif" className="loadingFull"></img>) : 
//       <div className="currentMatch">
//         <h1 className='matchupTitle'>Jogando agora</h1>
//         <div className="matchup">
//           <div className='TeamA'>
//             <FontAwesomeIcon icon={faA} className='faA' />
//             {teamA ? teamA.team_name : 'Aguardando time...'}
//           </div>
//           <span className="vs">VS</span>
//           <div className='TeamB'>
//             <FontAwesomeIcon icon={faB} className='faB' />
//             {teamB ? teamB.team_name : 'Aguardando time...'}
//           </div>
//         </div>
//       </div>
// }
//     {loading ? (null) : 
//       <div className="teamsList">
//         <h2 className='teamsListTitle'>Fila de times</h2>
//         {queue.length === 0 ? (
//           <div className="noTeamsRegistered">
//           <FontAwesomeIcon icon={faVolleyball} className='faVolleyball' />
//           <p className='noTeamsRegisteredText'>Nenhum time registrado</p>
//           </div>
//         ) : (
//           <ul className="queueList">
//             {queue.map((team) => (
//               <li key={team.id} className='queueItem'>
//                 <span className="queuePosition"><FontAwesomeIcon icon={faCaretRight} /></span>
//                 {team.team_name}
//                 <hr className='listLine' />
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     }
//     </div>
//   );
// }