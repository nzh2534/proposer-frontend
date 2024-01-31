import ProgressBar from 'react-bootstrap/ProgressBar';
import { useState, useEffect } from 'react';
import axiosInstance from '../axios';


function LoadingBar({pk, refresh}) {
    const [loadingProgress, updateloadingProgress] = useState(10);
    const [label, updateLabel] = useState("Initializing");

    const refreshProposal = () => {
        axiosInstance
          .get(`/proposals/${pk}`)
          .catch((error) => {
            console.log(error);
          })
          .then((res) => {
            var data = { ...res.data };
            if(data.pages_ran == 0){
                console.log("loading")
            } else if (data.pages_ran < (data.doc_end - data.doc_start) ) {
              var loadingUpdate = 10 + ( ((data.pages_ran + 1) / (data.doc_end - data.doc_start)) * 90)
              updateloadingProgress(loadingUpdate)
              updateLabel(`Processing Page ${data.pages_ran + 1} of ${(data.doc_end - data.doc_start)}`)
            } else if (data.pages_ran == (data.doc_end - data.doc_start) ) {
              updateloadingProgress(100);
              updateLabel('Saving');
            } else {
              console.log("not loading")
              axiosInstance
              .put(`proposals/${pk}/update/`, {
                title: data.title,
                loading: "False",
              })
              .catch((error) => {
                console.log(error.response);
              })
              .then((res) => {
                console.log(res);
                clearInterval(startInterval)
                refresh();

              });
            }
          });
      };

      const startInterval = setInterval(refreshProposal, 30000);
      useEffect(refreshProposal,[]);


    return (
        <ProgressBar style={{height: "5vh", width: "100%", marginBottom: "25vh"}} animated now={loadingProgress} label={`${label}`}/>
    );
}

export default LoadingBar;