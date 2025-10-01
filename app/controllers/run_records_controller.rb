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
    @run_record = RunRecord.build(run_record_params)
    if @run_record.save
      redirect_to @run_record, notice: "Run Saved!"
    else
      render :new, status: :unprocessable_content
    end
  end

  private
  def run_record_params
    params.require(:run_record).permit(:distance, :time, :pace)
  end
end
