import { JsonFieldSelector } from './json_field_selector.js';
import { RadiusSelector } from './radius_selector.js';

class RadiusConfig extends React.Component {
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
                        <input type="radio" name="radiusCalculation" id="radius-random" class="btn-check" />
                        <label class="btn btn-outline-primary" for="radius-random">Random</label>

                        <input type="radio" name="radiusCalculation" id="radius-fixed" class="btn-check" />
                        <label class="btn btn-outline-primary" for="radius-fixed">Fixed</label>

                        <input type="radio" name="radiusCalculation" id="radius-data" class="btn-check" />
                        <label class="btn btn-outline-primary active" for="radius-data">Dynamic</label>
                    </div>
                </div>
                <div class="row mb-4 text-muted text-center">
                    The bubble size is decided by a JSON field in the webhook message payload. The size will be
                    linearly interpolated between minimum and maximum value.
                </div>
                <JsonFieldSelector />
                <RadiusSelector />
            </form>
        )
    }
}

ReactDOM.createRoot(document.getElementById("radiusConfig")).render(React.createElement(RadiusConfig));