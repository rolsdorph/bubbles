export class FixedRadiusSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'radius': 25
        };
        this.updateRadius = this.updateRadius.bind(this);
    }

    updateRadius(event) {
        this.setState({
            'radius': event.target.value
        });
        this.props.onUpdate(
            { 'radius': event.target.value }
        );
    }

    render() {
        return (
            <div>
                <div class="row mb-3 align-items-center">
                    <div class="col-4">Bubble radius</div>
                    <div class="col-lg-5 col-md-6">
                        <input type="range" class="form-range" min="5" max="100" value={this.state.radius} onChange={this.updateRadius} />
                    </div>
                    <div class="col">
                        {this.state.radius}px
                    </div>
                </div>
            </div>
        )
    }
}