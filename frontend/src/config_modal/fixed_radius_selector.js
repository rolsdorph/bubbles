import React from 'react';

export class FixedRadiusSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'radius': 25
        };
        this.updateRadius = this.updateRadius.bind(this);
    }

    updateRadius(event) {
        const newRadius = parseInt(event.target.value);

        this.setState({
            'radius': newRadius
        });
        this.props.onUpdate(
            { 'radius': newRadius }
        );
    }

    render() {
        return (
            <div>
                <div className="row mb-3 align-items-center">
                    <div className="col-4">Bubble radius</div>
                    <div className="col-lg-5 col-md-6">
                        <input type="range" className="form-range" min="5" max="100" value={this.state.radius} onChange={this.updateRadius} />
                    </div>
                    <div className="col">
                        {this.state.radius}px
                    </div>
                </div>
            </div>
        )
    }
}