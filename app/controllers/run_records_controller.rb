class RunRecordsController < ApplicationController
  def index
    @run_records = RunRecord.all
  end
  def show
    @run_record  = RunRecord.find(params[:id])
  end
  def new
    @run_record = RunRecord.new
  end

  def create
    distance = params[:distance]
    coordinates = params[:coordinates]

    time_seconds = params[:time] / 1000.0
    time_duration = ActiveSupport::Duration.build(time_seconds)
    # Calculate hours, minutes, seconds, and milliseconds
    hours = (time_duration / 3600).to_i
    minutes = ((time_duration % 3600) / 60).to_i
    seconds = (time_duration % 60).to_i
    milliseconds = ((time_duration - seconds - (minutes * 60) - (hours * 3600)) * 1000).round

    # Create a Time object
    time_value = Time.at(time_seconds).utc.strftime("%H:%M:%S")

    # Format the time to include milliseconds
    time_with_milliseconds = "#{time_value}:#{milliseconds.to_s.rjust(3, '0')}"

    @run_record = RunRecord.new(
      distance: distance,
      time: time_with_milliseconds,
      pace: 0.0,
    )

    if @run_record.save
      coordinates.each do |coords|
        @run_record.run_paths.create(latitude: coords[0], longitude: coords[1])
      end
      render json: { success: true, run_record: @run_record }, status: :created
    else
      render json: { errors: @run_record.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private
  def run_record_params
    params.require(:run_record).permit(:distance, :time, :pace)
  end
end
