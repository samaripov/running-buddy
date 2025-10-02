class CreateRunPaths < ActiveRecord::Migration[8.0]
  def change
    create_table :run_paths do |t|
      t.references :run_record, null: false, foreign_key: true
      t.float :latitude, null: false
      t.float :longitude, null: false

      t.timestamps
    end
  end
end
