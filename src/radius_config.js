import { FixedRadiusSelector } from './fixed_radius_selector.js';
import { JsonFieldSelector } from './json_field_selector.js';
import { RangeRadiusSelector } from './range_radius_selector.js';

export class RadiusConfig extends React.Component {
    static random = 'random;'
    static fixed = 'fixed';
    static dynamic = 'dynamic';

    constructor(props) {
        super(props);
        this.state = {
            'radiusType': RadiusConfig.random,
            'radius': 40,
            'minRadius': 25,
            'maxRadius': 60,
            'minValue': null,
            'maxValue': null,
            'jsonField': null
        };

        this.randomRadiusSelected = this.randomRadiusSelected.bind(this);
        this.fixedRadiusSelected = this.fixedRadiusSelected.bind(this);
        this.dynamicRadiusSelected = this.dynamicRadiusSelected.bind(this);
        this.updateFormState = this.updateFormState.bind(this);
        this.onFixedUpdate = this.onFixedUpdate.bind(this);
        this.onRangeUpdate = this.onRangeUpdate.bind(this);
        this.onFieldUpdate = this.onFieldUpdate.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.save = this.save.bind(this);
        this.onSave = this.props.onSave;
    }

    save() {
        this.onSave({
            radiusType: this.state.radiusType,
            radius: this.state.radius,
            minRadius: this.state.minRadius,
            maxRadius: this.state.maxRadius,
            minValue: this.state.minValue,
            maxValue: this.state.maxValue,
            jsonField: this.state.jsonField,
        });
    }

    onFixedUpdate(event) {
        this.setState({
            'radius': event.radius
        });
    }

    onRangeUpdate(event) {
        this.setState({
            'minRadius': event.min,
            'maxRadius': event.max,
        });
    }

    onFieldUpdate(event) {
        this.setState({
            'jsonField': event.field,
            'minValue': event.min,
            'maxValue': event.max
        });
    }

    randomRadiusSelected() {
        return this.state.radiusType === RadiusConfig.random;
    }

    fixedRadiusSelected() {
        return this.state.radiusType === RadiusConfig.fixed;
    }

    dynamicRadiusSelected() {
        return this.state.radiusType === RadiusConfig.dynamic;
    }

    updateFormState(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    componentDidMount() {
        const modal = new bootstrap.Modal('#settings-modal');
        this.setState({
            'modal': modal
        });
    }

    showModal() {
        this.state.modal.show();
    }

    hideModal() {
        this.state.modal.hide();
    }

    render() {
        return (
            <React.Fragment>
                <span id="settingButton" onClick={this.showModal}>
                    <i id="settings-icon" className="bi bi-gear"></i>
                    Bubbles
                </span>
                <div id="settings-modal" className="modal" tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body row">
                                <form className="container mb-4 p-4" >
                                    <div className="row mb-4 text-center">
                                        <h4>
                                            Radius calculation
                                        </h4>
                                    </div>
                                    <div className="row mb-3">
                                        <div id="radius-calculation" className="btn-group mb-3" role="group"
                                            aria-label="Radius calculation">
                                            <input type="radio" name="radiusType" value={RadiusConfig.random} id="radius-random" className="btn-check" checked={this.randomRadiusSelected()}
                                                onChange={this.updateFormState}
                                            />
                                            <label className="btn btn-outline-primary" htmlFor="radius-random">Random</label>

                                            <input type="radio" name="radiusType" value={RadiusConfig.fixed} id="radius-fixed" className="btn-check" checked={this.fixedRadiusSelected()}
                                                onChange={this.updateFormState}
                                            />
                                            <label className="btn btn-outline-primary" htmlFor="radius-fixed">Fixed</label>

                                            <input type="radio" name="radiusType" value={RadiusConfig.dynamic} id="radius-data" className="btn-check" checked={this.dynamicRadiusSelected()}
                                                onChange={this.updateFormState}
                                            />
                                            <label className="btn btn-outline-primary" htmlFor="radius-data">Dynamic</label>
                                        </div>
                                    </div>
                                    <div className="row mb-4 text-muted text-center">
                                        {this.randomRadiusSelected() &&
                                            <span>
                                                The bubble size is randomly selected between the given min and max value.
                                            </span>
                                        }
                                        {this.fixedRadiusSelected() &&
                                            <span>
                                                All bubbles are the same size.
                                            </span>
                                        }
                                        {this.dynamicRadiusSelected() &&
                                            <span>
                                                The bubble size is decided by a JSON field in the webhook message payload. The size will be
                                                linearly interpolated between minimum and maximum value.
                                            </span>
                                        }
                                    </div>
                                    <hr />
                                    {(this.randomRadiusSelected() || this.dynamicRadiusSelected()) && <RangeRadiusSelector onUpdate={this.onRangeUpdate} initialMin={this.state.minRadius} initialMax={this.state.maxRadius} />}
                                    {this.fixedRadiusSelected() && <FixedRadiusSelector onUpdate={this.onFixedUpdate} />}
                                    {this.dynamicRadiusSelected() &&
                                        <div>
                                            <hr />
                                            <JsonFieldSelector onUpdate={this.onFieldUpdate} />
                                        </div>
                                    }
                                    <hr />

                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={this.hideModal}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.save}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}