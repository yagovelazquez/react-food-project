import classes from "./Labels.module.css"


function Labels(props) {

  

  

    return (
        props.labels.map(item => {



            let classDiv = classes.labels__Horizontal
            if (item.direction === "vertical") {
                classDiv = classes.labels__Vertical
            }

        
        
           return ( <div className={classDiv}>
            <span className={classes.labels__label}>{item.label}</span>
            <span className={classes.labels__span}>{item.value}</span>
        </div>) 
        })
  
      );
}

export default Labels;