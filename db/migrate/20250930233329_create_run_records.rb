class CreateRunRecords < ActiveRecord::Migration[8.0]
  def change
    create_table :run_records do |t|
      t.float :distance, null: false
      t.time :time, null: false
      t.float :pace, null: false

      t.timestamps
    end
  end
end
