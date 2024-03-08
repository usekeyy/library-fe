import React from 'react';
// import { Route, Link } from 'react-router-dom';
import { Collapse, CardHeader, CardBody, Card } from 'reactstrap';

class BlankSideAccordion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1',
            activePill: '1',
            collapse: [
                { id: 1, collapse: true },
            ],
            children: [
               
            ]
        };
        
        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    componentDidMount(){
      
    }


    toggleCollapse(index) {
        console.log(this.props.match)
        var newArray = [];
        for (let collapseObj of this.state.collapse) {
            if (collapseObj.id === index) {
                collapseObj.collapse = !collapseObj.collapse;
            } else {
                collapseObj.collapse = false;
            }
            newArray.push(collapseObj);
        }
        this.setState({
            collapse: newArray
        });
    }

    render() {
        // const actived = {
        //     'backgroundColor': '#369156',
        //     'borderRadius': '7px',
        //     'color': 'white',
        //     'fontWeight': 'bold'
        // }

        return (
            <div>
                <div id="accordion" className="accordion">
                    {
                        this.state.collapse.map((value, i) => (
                            <Card className="text-white" key={i}>
                                <CardHeader style={{ backgroundColor: "#0c7b30" }}>
                                </CardHeader>
                                <Collapse isOpen={value.collapse}>
                                    <CardBody className="bg-white text-black">
                                       
                                    </CardBody>
                                </Collapse>
                            </Card>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default BlankSideAccordion