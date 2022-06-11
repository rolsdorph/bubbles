export class RangeRadiusSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'min': 25,
            'max': 60
        };

        this.updateMin = this.updateMin.bind(this);
        this.updateMax = this.updateMax.bind(this);
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
    }

    render() {
        return (
            <div>
                <div class="row mb-3 align-items-center">
                    <div class="col-4">Smallest bubble radius</div>
                    <div class="col-lg-5 col-md-6">
                        <input type="range" name="min" class="form-range" min="5" max="100" value={this.state.min} onChange={this.updateMin} />
                    </div>
                    <div class="col">
                        {this.state.min}px
                    </div>
                </div>
                <div class="row align-items-center">
                    <div class="col-4">Largest bubble radius</div>
                    <div class="col-lg-5 col-md-6">
                        <input type="range" name="max" class="form-range" min="5" max="100" value={this.state.max} onChange={this.updateMax} />
                    </div>
                    <div class="col">
                        {this.state.max}px
                    </div>
                </div>
            </div>
        )
    }
}