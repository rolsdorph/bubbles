import { Tooltip } from 'bootstrap';

export class JsonFieldSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'field': '',
            'min': '',
            'max': ''
        };

        this.updateFormState = this.updateFormState.bind(this);
    }

    componentDidMount() {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl));
    }

    updateFormState(event) {
        const newState = { [event.target.name]: event.target.value };
        this.setState(newState, () => {
            this.props.onUpdate({
                'field': this.state.field,
                'min': this.state.min,
                'max': this.state.max,
            })
        });
    }

    render() {
        return (
            <div>
                <div className="row mb-3 align-items-center">
                    <div className="col-4">
                        JSON field
                    </div>
                    <div className="col-lg-5 col-md-6">
                        <input type="text" name="field" id="radius-field-name" className="form-control"
                            aria-describedby="radius-field-name-help" placeholder="my.data.field" value={this.state.field} onChange={this.updateFormState} />
                    </div>
                    <div className="col">
                        <i className="bi bi-info-circle" data-bs-toggle="tooltip" data-bs-placement="right"
                            data-bs-offset="[0,20]"
                            title="The JSON field to fetch a numeric value from. Use dots for nested fields."></i>
                    </div>
                </div>
                <div className="row align-items-center">
                    <div className="col-4">
                        Value range
                    </div>
                    <div className="col-lg-5 col-md-6">
                        <div className="row align-items-center">
                            <div className="col">
                                <input type="number" name="min" id="radius-field-min" className="form-control"
                                    placeholder="Min" value={this.state.min} onChange={this.updateFormState} />
                            </div>
                            -
                            <div className="col">
                                <input type="number" name="max" id="radius-field-max" className="form-control"
                                    placeholder="Max" value={this.state.max} onChange={this.updateFormState} />
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <i className="bi bi-info-circle" data-bs-toggle="tooltip" data-bs-placement="right"
                            data-bs-offset="[0,20]"
                            title="Values outside this range map to the smallest/largest bubble size."></i>
                    </div>
                </div>
            </div>
        )
    }
}