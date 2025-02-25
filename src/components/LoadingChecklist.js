import "../App.css";
import { useEffect } from 'react';
import axiosInstance from '../axios';

function LoadingChecklist({pk, refresh, loading_checklist}) {

    const refreshProposal = () => {
        if (loading_checklist){
            axiosInstance
                .get(`/proposals/${pk}`)
                .catch((error) => {
                    console.log(error);
                })
                .then((res) => {
                    var data = { ...res.data };
                    if(!data.loading_checklist ){
                        clearInterval(startInterval)
                        refresh();
                    }})
        }
        };


      const startInterval = setInterval(refreshProposal, 30000);
      useEffect(refreshProposal,[]);


  return (
    <div className="d-flex justify-content-center Center-item">
        <span>Loading AI Reponses...</span>
      <div className="spinner-border mt-2" role="status">
      </div>
    </div>
  );
}

export default LoadingChecklist;