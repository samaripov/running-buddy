class RunRecord < ApplicationRecord
  has_many :run_paths, dependent: :destroy
end
