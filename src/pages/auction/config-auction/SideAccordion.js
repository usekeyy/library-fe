import React from 'react';
import { Route, Link } from 'react-router-dom';
import { Collapse, CardHeader, CardBody, Card } from 'reactstrap';

class SideAccordion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1',
            activePill: '1',
            collapse: [
                { id: 1, collapse: true },
            ],
            children: [
                { path: "/auction/parameter-auction/" + props.uuid, name: "Parameter Auction  ", id: "parameter-auction" },
                { path: "/auction/item-auction/" + props.uuid, name: "Item Auction", id: "item-auction" },
                { path: "/auction/peserta-auction/" + props.uuid, name: "Peserta Lelang", id: "peserta-auction" },
                { path: "/auction/schedule-auction/" + props.uuid, name: "Jadwal", id: "schedule-auction" },
                { path: "/auction/history-auction/" + props.uuid, name: "History", id: "history-auction" },
                { path: "/auction/term-auction/" + props.uuid, name: "Petunjuk Peraturan", id: "term-auction" },
            ]
        };
        // console.log(props.status);
        console.log(this.props.header.header);
        
        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    componentDidMount(){
        if(this.props.header.header.status!=="n"){
            var arr = this.state.children;
            arr.push( { path: "/auction/monitoring-buyyer/" + this.props.uuid, name: "Proses", id: "proses" })
            this.setState({children : arr});
        }
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
        const actived = {
            'backgroundColor': '#369156',
            'borderRadius': '7px',
            'color': 'white',
            'fontWeight': 'bold'
        }

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
                                        {this.state.children.map((child, childKey) => (
                                            <ul key={childKey} style={(this.props.actived === child.id) ? actived : null} className="m-l-0">
                                                <Route>
                                                    <li className="set-pointer" style={(this.props.actived === child.id) ? actived : null} >
                                                        <Link style={(this.props.actived === child.id) ? actived : null} to={child.path}>{child.name}</Link>
                                                    </li>
                                                </Route>
                                            </ul>
                                        ))}
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

export default SideAccordion