import React from 'react';
import '../loaderstyles.css';

export default function Loading() {

  return(
    <div className="container container-transparent">
      <div className="row mobile_row">

        <div className="col-12 mobile_col text-center">
          <div className="ct-loader style1">
            <div className="loading-spin">
            	<div className="spinner">
            	    <div className="right-side"><div className="bar"></div></div>
            	    <div className="left-side"><div className="bar"></div></div>
            	</div>
            	<div className="spinner color-2">
            	    <div className="right-side"><div className="bar"></div></div>
            	    <div className="left-side"><div className="bar"></div></div>
            	</div>
      			
       		</div>
          </div>
        </div>

      </div>
    </div>

  )
}

