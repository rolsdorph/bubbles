import { FixedRadiusSelector } from './fixed_radius_selector.js';
import { JsonFieldSelector } from './json_field_selector.js';
import { RangeRadiusSelector } from './range_radius_selector.js';

class RadiusConfig extends React.Component {
    static random = 'random;'
    static fixed = 'fixed';
    static dynamic = 'dynamic';

    constructor(props) {
        super(props);
        this.state = {
            'radiusType': RadiusConfig.random
        };

        this.randomRadiusSelected = this.randomRadiusSelected.bind(this);
        this.fixedRadiusSelected = this.fixedRadiusSelected.bind(this);
        this.dynamicRadiusSelected = this.dynamicRadiusSelected.bind(this);
        this.updateFormState = this.updateFormState.bind(this);
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

    render() {
        return (
            <form class="container mb-4 p-4">
                <div class="row mb-4 text-center">
                    <h4>
                        Radius calculation
                    </h4>
                </div>
                <div class="row">
                    <div id="radius-calculation" class="btn-group mb-3" role="group"
                        aria-label="Radius calculation">
                        <input type="radio" name="radiusType" value={RadiusConfig.random} id="radius-random" class="btn-check" checked={this.randomRadiusSelected()}
                            onChange={this.updateFormState}
                        />
                        <label class="btn btn-outline-primary" for="radius-random">Random</label>

                        <input type="radio" name="radiusType" value={RadiusConfig.fixed} id="radius-fixed" class="btn-check" checked={this.fixedRadiusSelected()}
                            onChange={this.updateFormState}
                        />
                        <label class="btn btn-outline-primary" for="radius-fixed">Fixed</label>

                        <input type="radio" name="radiusType" value={RadiusConfig.dynamic} id="radius-data" class="btn-check" checked={this.dynamicRadiusSelected()}
                            onChange={this.updateFormState}
                        />
                        <label class="btn btn-outline-primary" for="radius-data">Dynamic</label>
                    </div>
                </div>
                <div class="row mb-4 text-muted text-center">
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
                {(this.randomRadiusSelected() || this.dynamicRadiusSelected()) && <RangeRadiusSelector />}
                {this.fixedRadiusSelected() && <FixedRadiusSelector />}
                {this.dynamicRadiusSelected() &&
                    <div>
                        <hr />
                        <JsonFieldSelector />
                    </div>
                }
                <hr />

            </form>
        )
    }
}

ReactDOM.createRoot(document.getElementById("radiusConfig")).render(React.createElement(RadiusConfig));