export class RadiusSelector extends React.Component {
    render() {
        return (
            <div>
                <div class="row mb-3 align-items-center">
                    <div class="col-4">Smallest bubble radius</div>
                    <div class="col-lg-5 col-md-6">
                        <input type="range" class="form-range" min="5" max="100" defaultValue="25" />
                    </div>
                    <div class="col">
                        25px
                    </div>
                </div>
                <div class="row align-items-center">
                    <div class="col-4">Largest bubble radius</div>
                    <div class="col-lg-5 col-md-6">
                        <input type="range" class="form-range" min="5" max="100" defaultValue="60" />
                    </div>
                    <div class="col">
                        60px
                    </div>
                </div>
            </div>
        )
    }
}