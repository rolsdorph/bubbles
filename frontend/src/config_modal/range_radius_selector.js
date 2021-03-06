import React from 'react';

export class RangeRadiusSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'min': props.initialMin,
            'max': props.initialMax
        };

        this.updateMin = this.updateMin.bind(this);
        this.updateMax = this.updateMax.bind(this);
    }

    onUpdate() {
        this.props.onUpdate({
            'min': this.state.min,
            'max': this.state.max
        });
    }

    updateMin(event) {
        const newMin = parseInt(event.target.value);

        this.setState((oldState, props) => {
            if (newMin <= oldState.max) {
                return {
                    'min': newMin
                };
            } else {
                return oldState;
            }
        });

        this.onUpdate();
    }

    updateMax(event) {
        const newMax = parseInt(event.target.value);

        this.setState((oldState, props) => {
            if (newMax >= oldState.min) {
                return {
                    'max': newMax
                };
            } else {
                return oldState;
            }
        });

        this.onUpdate();
    }

    render() {
        return (
            <div>
                <div className="row mb-3 align-items-center">
                    <div className="col-4">Smallest bubble radius</div>
                    <div className="col-lg-5 col-md-6">
                        <input type="range" name="min" className="form-range" min="5" max="100" value={this.state.min} onChange={this.updateMin} />
                    </div>
                    <div className="col">
                        {this.state.min}px
                    </div>
                </div>
                <div className="row align-items-center">
                    <div className="col-4">Largest bubble radius</div>
                    <div className="col-lg-5 col-md-6">
                        <input type="range" name="max" className="form-range" min="5" max="100" value={this.state.max} onChange={this.updateMax} />
                    </div>
                    <div className="col">
                        {this.state.max}px
                    </div>
                </div>
            </div>
        )
    }
}