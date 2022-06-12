export class JsonFieldSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'field': null,
            'min': null,
            'max': null
        };

        this.updateFormState = this.updateFormState.bind(this);
    }
    componentDidMount() {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }

    updateFormState(event) {
        const newState = { [event.target.name]: event.target.value };
        this.setState({
            newState
        });

        this.props.onUpdate(newState);
    }

    render() {
        return (
            <div>
                <div class="row mb-3 align-items-center">
                    <div class="col-4">
                        JSON field
                    </div>
                    <div class="col-lg-5 col-md-6">
                        <input type="text" name="field" id="radius-field-name" class="form-control"
                            aria-describedby="radius-field-name-help" placeholder="my.data.field" value={this.state.field} onChange={this.updateFormState} />
                    </div>
                    <div class="col">
                        <i class="bi bi-info-circle" data-bs-toggle="tooltip" data-bs-placement="right"
                            data-bs-offset="[0,20]"
                            title="The JSON field to fetch a numeric value from. Use dots for nested fields."></i>
                    </div>
                </div>
                <div class="row align-items-center">
                    <div class="col-4">
                        Value range
                    </div>
                    <div class="col-lg-5 col-md-6">
                        <div class="row align-items-center">
                            <div class="col">
                                <input type="number" name="min" id="radius-field-min" class="form-control"
                                    placeholder="Min" value={this.state.min} onChange={this.updateFormState} />
                            </div>
                            -
                            <div class="col">
                                <input type="number" name="max" id="radius-field-max" class="form-control"
                                    placeholder="Max" value={this.state.max} onChange={this.updateFormState} />
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <i class="bi bi-info-circle" data-bs-toggle="tooltip" data-bs-placement="right"
                            data-bs-offset="[0,20]"
                            title="Values outside this range map to the smallest/largest bubble size."></i>
                    </div>
                </div>
            </div>
        )
    }
}