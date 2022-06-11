export class JsonFieldSelector extends React.Component {
    componentDidMount() {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    }

    render() {
        return (
            <div>
                <div class="row mb-3 align-items-center">
                    <div class="col-4">
                        JSON field
                    </div>
                    <div class="col-lg-5 col-md-6">
                        <input type="text" id="radius-field-name" class="form-control"
                            aria-describedby="radius-field-name-help" placeholder="my.data.field" />
                    </div>
                    <div class="col">
                        <i class="bi bi-info-circle" data-bs-toggle="tooltip" data-bs-placement="right"
                            data-bs-offset="[0,20]"
                            title="The JSON field to fetch a numeric value from. Use dots for nested fields."></i>
                    </div>
                </div>
                <div class="row mb-3 align-items-center">
                    <div class="col-4">
                        Value range
                    </div>
                    <div class="col-lg-5 col-md-6">
                        <div class="row align-items-center">
                            <div class="col">
                                <input type="number" id="radius-field-min" class="form-control"
                                    placeholder="Min" />
                            </div>
                            -
                            <div class="col">
                                <input type="number" id="radius-field-max" class="form-control"
                                    placeholder="Max" />
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